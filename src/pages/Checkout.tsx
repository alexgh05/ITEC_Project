import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Check } from 'lucide-react';
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
  { id: "credit", name: "Credit Card" },
  { id: "paypal", name: "PayPal" },
  { id: "applepay", name: "Apple Pay" },
];

const Checkout = () => {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const shipping = subtotal > 0 ? 9.99 : 0;
  const tax = subtotal * 0.08; // Assuming 8% tax
  const total = subtotal + shipping + tax;
  
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formComplete, setFormComplete] = useState(false);
  
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

  useEffect(() => {
    // Set page title
    document.title = "Checkout | CultureDrop";
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Redirect to cart if cart is empty
    if (items.length === 0) {
      navigate('/cart');
      toast.error("Your cart is empty");
    }
  }, [items, navigate]);
  
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
      if (paymentMethod === "credit") {
        const { cardName, cardNumber, cardExpiry, cardCvc } = formData;
        setFormComplete(
          cardName !== "" && 
          cardNumber !== "" && 
          cardExpiry !== "" && 
          cardCvc !== ""
        );
      } else {
        setFormComplete(true); // Other payment methods don't require additional info
      }
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
    
    // Simulate API call to process order
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Order successful!
      clearCart();
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast.error("There was an error processing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
                    <RadioGroup 
                      value={paymentMethod} 
                      onValueChange={setPaymentMethod}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      {paymentMethods.map(method => (
                        <div key={method.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <Label htmlFor={method.id}>{method.name}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    
                    {paymentMethod === "credit" && (
                      <div className="mt-6 space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input 
                            id="cardName" 
                            name="cardName" 
                            placeholder="John Doe" 
                            value={formData.cardName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input 
                            id="cardNumber" 
                            name="cardNumber" 
                            placeholder="1234 5678 9012 3456" 
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="cardExpiry">Expiration Date</Label>
                            <Input 
                              id="cardExpiry" 
                              name="cardExpiry" 
                              placeholder="MM/YY" 
                              value={formData.cardExpiry}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="cardCvc">CVC</Label>
                            <Input 
                              id="cardCvc" 
                              name="cardCvc" 
                              placeholder="123" 
                              value={formData.cardCvc}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === "paypal" && (
                      <div className="mt-6 text-center p-6 border rounded-lg">
                        <p className="mb-4">You will be redirected to PayPal to complete your payment.</p>
                        <CreditCard className="h-12 w-12 mx-auto text-muted-foreground" />
                      </div>
                    )}
                    
                    {paymentMethod === "applepay" && (
                      <div className="mt-6 text-center p-6 border rounded-lg">
                        <p className="mb-4">You will complete your payment using Apple Pay.</p>
                        <CreditCard className="h-12 w-12 mx-auto text-muted-foreground" />
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
                    <p>
                      We've sent a confirmation email to <span className="font-medium">{formData.email}</span> with all the details of your purchase.
                    </p>
                    
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-medium mb-2">Shipping Address</h3>
                      <p className="text-sm text-muted-foreground">
                        {formData.firstName} {formData.lastName}<br />
                        {formData.address}<br />
                        {formData.city}, {formData.state} {formData.zip}<br />
                        {countries.find(c => c.value === formData.country)?.label}
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
                    <span className="text-muted-foreground">Items ({totalItems})</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <h3 className="font-medium">Order Details</h3>
                    {items.map(item => (
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