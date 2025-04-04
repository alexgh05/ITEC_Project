import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Trash2, ArrowLeft, Plus, Minus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

const Cart = () => {
  const { items, getTotalItems, getTotalPrice, removeItem, updateQuantity, clearCart } = useCartStore();
  const navigate = useNavigate();
  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const shipping = subtotal > 0 ? 9.99 : 0;
  const total = subtotal + shipping;

  useEffect(() => {
    // Set page title
    document.title = "Shopping Cart | CultureDrop";
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id);
    toast.success(`${name} removed from cart`);
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    navigate('/checkout');
  };

  return (
    <>
      <section className="py-12 px-4 bg-secondary/50">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/shop">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-4xl font-bold">Shopping Cart</h1>
          </div>
          <p className="text-muted-foreground">Review your items before checkout</p>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="container mx-auto">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-medium">Your cart is empty</h2>
              <p className="mt-2 text-muted-foreground">Start adding items to your cart</p>
              <Button className="mt-6" asChild>
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-medium mb-4">Cart Items ({totalItems})</h2>
                    <div className="hidden md:grid grid-cols-12 gap-4 mb-4 text-sm font-medium text-muted-foreground">
                      <div className="col-span-6">Product</div>
                      <div className="col-span-2 text-center">Price</div>
                      <div className="col-span-2 text-center">Quantity</div>
                      <div className="col-span-2 text-center">Total</div>
                    </div>
                    
                    <Separator className="mb-6" />
                    
                    {items.map((item) => (
                      <motion.div 
                        key={`${item.id}-${item.selectedSize}`}
                        className="mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          <div className="md:col-span-6 flex items-center gap-4">
                            <div className="h-20 w-20 bg-secondary rounded-md overflow-hidden">
                              <img 
                                src={item.images[0]} 
                                alt={item.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {item.culture} • Size: {item.selectedSize}
                              </p>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 px-2 text-destructive hover:text-destructive mt-1 md:hidden"
                                onClick={() => handleRemoveItem(item.id, item.name)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>
                          
                          <div className="md:col-span-2 flex justify-between md:justify-center items-center">
                            <span className="md:hidden font-medium">Price:</span>
                            <span>${item.price.toFixed(2)}</span>
                          </div>
                          
                          <div className="md:col-span-2 flex justify-between md:justify-center items-center">
                            <span className="md:hidden font-medium">Quantity:</span>
                            <div className="flex items-center border rounded-md">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-r-none"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-l-none"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="md:col-span-2 flex justify-between md:justify-center items-center">
                            <span className="md:hidden font-medium">Total:</span>
                            <div className="flex items-center justify-between w-full md:w-auto">
                              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive hover:text-destructive hidden md:flex"
                                onClick={() => handleRemoveItem(item.id, item.name)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {items.indexOf(item) < items.length - 1 && (
                          <Separator className="my-6" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="bg-muted p-6 flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        clearCart();
                        toast.success("Cart cleared");
                      }}
                    >
                      Clear Cart
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/shop">Continue Shopping</Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg shadow-sm border p-6 sticky top-24">
                  <h2 className="text-xl font-medium mb-6">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    
                    <Button 
                      className="w-full mt-4"
                      size="lg"
                      onClick={handleProceedToCheckout}
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Cart; 