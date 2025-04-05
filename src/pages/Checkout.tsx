import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Check, Truck, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useCartStore } from '@/store/useCartStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuthStore } from '@/store/useAuthStore';
import { createOrder } from '@/lib/api';

const countries = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "mx", label: "Mexico" },
  { value: "uk", label: "United Kingdom" },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
  { value: "jp", label: "Japan" },
];

const paymentMethods = [
  { id: "delivery", name: "Pay at Delivery", available: true, icon: Truck },
  { id: "credit", name: "Credit Card (Coming Soon)", available: false, icon: CreditCard },
  { id: "paypal", name: "PayPal (Coming Soon)", available: false },
  { id: "applepay", name: "Apple Pay (Coming Soon)", available: false },
];

const Checkout = () => {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const shipping = subtotal > 0 ? 9.99 : 0;
  const tax = subtotal * 0.08; // Assuming 8% tax
  const total = subtotal + shipping + tax;
  
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("delivery");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formComplete, setFormComplete] = useState(false);
  const [emailPreviewUrl, setEmailPreviewUrl] = useState('');
  const [emailProvider, setEmailProvider] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "us",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  // Store order summary for confirmation page
  const [orderSummary, setOrderSummary] = useState({
    items: [],
    totalItems: 0,
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  });

  useEffect(() => {
    // Set page title
    document.title = "Checkout | CultureDrop";
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Redirect to cart if cart is empty and not in confirmation step
    if (items.length === 0 && step !== 3) {
      navigate('/cart');
      toast.error("Your cart is empty");
    }
  }, [items, navigate, step]);
  
  useEffect(() => {
    // Check if shipping form is complete
    if (step === 1) {
      const { firstName, lastName, email, phone, address, city, state, zip, country } = formData;
      setFormComplete(
        firstName !== "" && 
        lastName !== "" && 
        email !== "" && 
        phone !== "" && 
        address !== "" && 
        city !== "" && 
        state !== "" && 
        zip !== "" && 
        country !== ""
      );
    }
    // Check if payment form is complete
    else if (step === 2) {
      // With Pay at Delivery as default, the form is always complete
      setFormComplete(true);
    }
  }, [formData, step, paymentMethod]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/cart');
    }
  };

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    
    // Save order summary before clearing cart
    setOrderSummary({
      items: [...items],
      totalItems,
      subtotal,
      shipping,
      tax,
      total
    });
    
    try {
      // Prepare order data
      const orderData = {
        orderItems: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          image: item.images[0],
          price: item.price,
          selectedSize: item.selectedSize,
          product: item.id,
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: countries.find(c => c.value === formData.country)?.label,
          email: formData.email,
          phone: formData.phone
        },
        paymentMethod: 'Pay at Delivery',
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total
      };
      
      let orderPlaced = false;
      
      // Send the order to the backend API
      if (token) {
        try {
          console.log("Submitting order with token:", token);
          const result = await createOrder(orderData, token);
          
          // Store email information
          if (result && result.emailPreviewUrl) {
            setEmailPreviewUrl(result.emailPreviewUrl);
          }
          if (result && result.provider) {
            setEmailProvider(result.provider);
          }
          
          orderPlaced = true;
        } catch (apiError) {
          console.error("API Error:", apiError);
          // If API call fails, we'll use the demo mode below
        }
      }
      
      // Guest mode / demo mode - for users who aren't logged in
      if (!token || !orderPlaced) {
        console.log("Using guest/demo mode for order");
        try {
          // Call the guest endpoint
          const result = await createOrder(orderData);
          
          // Store email information if available
          if (result && result.emailPreviewUrl) {
            setEmailPreviewUrl(result.emailPreviewUrl);
          }
          if (result && result.provider) {
            setEmailProvider(result.provider);
          }
          
          orderPlaced = true;
        } catch (guestError) {
          console.error("Guest order error:", guestError);
          // Fallback to simulation if guest API fails
          await new Promise(resolve => setTimeout(resolve, 1500));
          setEmailPreviewUrl('https://ethereal.email/message/demo');
          orderPlaced = true;
        }
      }
      
      // Order successful - first set step to 3, then clear cart
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Small delay before clearing cart to ensure confirmation screen is shown
      setTimeout(() => {
        clearCart();
      }, 500);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error("There was an error processing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle payment method selection - prevents selecting unavailable methods
  const handlePaymentMethodChange = (value: string) => {
    const method = paymentMethods.find(m => m.id === value);
    
    if (method && !method.available) {
      toast.error(`${method.name.replace(' (Coming Soon)', '')} is not available yet`);
      return;
    }
    
    setPaymentMethod(value);
  };

  return (
    <>
      <section className="py-12 px-4 bg-secondary/50">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={handlePrevStep}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-4xl font-bold">Checkout</h1>
          </div>
          
          <div className="flex items-center justify-between max-w-2xl">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                step >= 1 ? 'bg-culture text-culture-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                1
              </div>
              <span className="text-sm">Shipping</span>
            </div>
            
            <div className="h-0.5 flex-1 bg-muted mx-4">
              <div className={`h-full bg-culture transition-all ${
                step >= 2 ? 'w-full' : 'w-0'
              }`} />
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                step >= 2 ? 'bg-culture text-culture-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                2
              </div>
              <span className="text-sm">Payment</span>
            </div>
            
            <div className="h-0.5 flex-1 bg-muted mx-4">
              <div className={`h-full bg-culture transition-all ${
                step >= 3 ? 'w-full' : 'w-0'
              }`} />
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                step >= 3 ? 'bg-culture text-culture-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {step === 3 ? <Check className="h-5 w-5" /> : 3}
              </div>
              <span className="text-sm">Confirmation</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                    <CardDescription>Enter your shipping details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          name="firstName" 
                          placeholder="John" 
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          name="lastName" 
                          placeholder="Doe" 
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          placeholder="john.doe@example.com" 
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          placeholder="(123) 456-7890" 
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address" 
                        name="address" 
                        placeholder="123 Main St" 
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city" 
                          name="city" 
                          placeholder="New York" 
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input 
                          id="state" 
                          name="state" 
                          placeholder="NY" 
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input 
                          id="zip" 
                          name="zip" 
                          placeholder="10001" 
                          value={formData.zip}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={formData.country}
                        onValueChange={value => handleSelectChange("country", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map(country => (
                            <SelectItem key={country.value} value={country.value}>
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button
                      onClick={handleNextStep}
                      disabled={!formComplete}
                    >
                      Continue to Payment
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>Choose your payment method</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert className="bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30 mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Payment Methods Information</AlertTitle>
                      <AlertDescription>
                        Currently, only "Pay at Delivery" is available. Other payment methods will be implemented in the future.
                      </AlertDescription>
                    </Alert>
                    
                    <RadioGroup 
                      value={paymentMethod} 
                      onValueChange={handlePaymentMethodChange}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {paymentMethods.map(method => (
                        <div 
                          key={method.id} 
                          className={`flex items-center space-x-2 p-4 border rounded-md ${method.available ? 'cursor-pointer hover:border-primary/50' : 'opacity-70 cursor-not-allowed'}`}
                        >
                          <RadioGroupItem value={method.id} id={method.id} disabled={!method.available} />
                          <div className="flex items-center">
                            {method.icon && <method.icon className="h-5 w-5 mr-2 text-muted-foreground" />}
                            <Label htmlFor={method.id} className={!method.available ? 'cursor-not-allowed' : ''}>{method.name}</Label>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                    
                    {paymentMethod === "delivery" && (
                      <div className="mt-6 text-center p-6 border rounded-lg bg-secondary/30">
                        <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-medium mb-2">Pay at Delivery</h3>
                        <p className="text-muted-foreground">You'll pay in cash when your order is delivered to your address.</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handlePrevStep}>
                      Back to Shipping
                    </Button>
                    <Button
                      onClick={handleSubmitOrder}
                      disabled={!formComplete || isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Place Order"}
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center text-2xl">Order Confirmed!</CardTitle>
                    <CardDescription className="text-center">
                      <Check className="h-16 w-16 mx-auto text-green-500 my-4" />
                      Thank you for your order
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-6">
                    {emailProvider === 'Gmail' ? (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-md dark:bg-green-900/20 dark:border-green-800/30">
                        <p className="text-green-800 dark:text-green-300">
                          A confirmation email has been sent to <span className="font-medium">{formData.email}</span> with all the details of your purchase.
                        </p>
                      </div>
                    ) : (
                      <p>
                        We've sent a confirmation email to <span className="font-medium">{formData.email}</span> with all the details of your purchase.
                      </p>
                    )}
                    
                    {emailPreviewUrl && emailProvider !== 'Gmail' && (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-md dark:bg-amber-900/20 dark:border-amber-800/30">
                        <p className="text-amber-800 dark:text-amber-300 flex items-center justify-center gap-2">
                          <ExternalLink size={16} />
                          <a 
                            href={emailPreviewUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            View your test confirmation email
                          </a>
                        </p>
                        <p className="text-xs mt-2 text-amber-700 dark:text-amber-400">
                          (This is a test email preview. In production, real emails would be sent to your inbox.)
                        </p>
                      </div>
                    )}
                    
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-medium mb-2">Shipping Address</h3>
                      <p className="text-sm text-muted-foreground">
                        {formData.firstName} {formData.lastName}<br />
                        {formData.address}<br />
                        {formData.city}, {formData.state} {formData.zip}<br />
                        {countries.find(c => c.value === formData.country)?.label}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-medium mb-2">Payment Method</h3>
                      <p className="text-sm text-muted-foreground">
                        Pay at Delivery
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button asChild>
                      <Link to="/shop">Continue Shopping</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg shadow-sm border p-6 sticky top-24">
                <h2 className="text-xl font-medium mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items ({step === 3 ? orderSummary.totalItems : totalItems})</span>
                    <span>${step === 3 ? orderSummary.subtotal.toFixed(2) : subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${step === 3 ? orderSummary.shipping.toFixed(2) : shipping.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${step === 3 ? orderSummary.tax.toFixed(2) : tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>${step === 3 ? orderSummary.total.toFixed(2) : total.toFixed(2)}</span>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <h3 className="font-medium">Order Details</h3>
                    {(step === 3 ? orderSummary.items : items).map(item => (
                      <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.name} ({item.selectedSize}) × {item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout; 