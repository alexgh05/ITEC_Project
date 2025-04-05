import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { getUserOrders } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Package, Clock, Check, ShoppingBag, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define order type
interface OrderItem {
  name: string;
  quantity: number;
  image: string;
  price: number;
  product: {
    _id: string;
    name: string;
  };
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt: string;
  isDelivered: boolean;
  deliveredAt: string;
  createdAt: string;
}

const Orders = () => {
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<(Order & { isViewDialogOpen?: boolean }) | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;

      try {
        const ordersData = await getUserOrders(token);
        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: 'Error',
          description: 'Failed to load orders',
          variant: 'destructive'
        });
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, toast]);

  // Separate active and finished orders
  const activeOrders = orders.filter(order => !order.isDelivered);
  const finishedOrders = orders.filter(order => order.isDelivered);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Handler for viewing order details
  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder({ ...order, isViewDialogOpen: true });
  };

  if (!user) {
    return null;
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Orders</h1>
              <p className="text-muted-foreground mt-1">Track and manage your orders</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : orders.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <div className="flex flex-col items-center">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No orders found</h3>
                  <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
                  <Button onClick={() => navigate('/shop')}>Start Shopping</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="active" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="active">
                  <Clock className="h-4 w-4 mr-2" />
                  Active Orders ({activeOrders.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  <Check className="h-4 w-4 mr-2" />
                  Completed Orders ({finishedOrders.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                {activeOrders.length === 0 ? (
                  <Card className="text-center py-8">
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No active orders</h3>
                        <p className="text-muted-foreground">All your orders have been delivered.</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  activeOrders.map((order) => (
                    <OrderCard 
                      key={order._id} 
                      order={order} 
                      onViewDetails={handleViewOrderDetails}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {finishedOrders.length === 0 ? (
                  <Card className="text-center py-8">
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <Check className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No completed orders</h3>
                        <p className="text-muted-foreground">Your orders are still being processed.</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  finishedOrders.map((order) => (
                    <OrderCard 
                      key={order._id} 
                      order={order}
                      onViewDetails={handleViewOrderDetails}
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
          
          {/* Order Details Dialog */}
          {selectedOrder && (
            <Dialog 
              open={!!selectedOrder.isViewDialogOpen} 
              onOpenChange={(open) => {
                if (!open) {
                  setSelectedOrder(null);
                }
              }}
            >
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>Order Details #{selectedOrder._id.slice(-6)}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedOrder.isDelivered 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {selectedOrder.isDelivered ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Delivered
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          Processing
                        </>
                      )}
                    </span>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="grid md:grid-cols-2 gap-6 py-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Order Information</h3>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date Placed:</span>
                        <span>{formatDate(selectedOrder.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Order ID:</span>
                        <span>{selectedOrder._id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Method:</span>
                        <span>{selectedOrder.paymentMethod}</span>
                      </div>
                      {selectedOrder.isDelivered && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Delivered On:</span>
                          <span>{formatDate(selectedOrder.deliveredAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Shipping Address</h3>
                    <p className="text-sm">
                      {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}<br />
                      {selectedOrder.shippingAddress.address}<br />
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}<br />
                      {selectedOrder.shippingAddress.country}
                      {selectedOrder.shippingAddress.phone && (
                        <>
                          <br />Phone: {selectedOrder.shippingAddress.phone}
                        </>
                      )}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="py-4">
                  <h3 className="text-sm font-medium mb-4">Order Items</h3>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.orderItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded bg-muted flex-shrink-0 overflow-hidden">
                                  <img 
                                    src={item.image} 
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                <Separator />
                
                <div className="py-4">
                  <h3 className="text-sm font-medium mb-2">Order Summary</h3>
                  <div className="space-y-1 text-sm max-w-xs ml-auto">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>${(selectedOrder.totalPrice - selectedOrder.taxPrice - selectedOrder.shippingPrice).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping:</span>
                      <span>${selectedOrder.shippingPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax:</span>
                      <span>${selectedOrder.taxPrice.toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span>${selectedOrder.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </motion.div>
      </div>
    </section>
  );
};

// Order Card Component with onViewDetails prop
interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
}

const OrderCard = ({ order, onViewDetails }: OrderCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Order #{order._id.slice(-8)}</CardTitle>
            <CardDescription>Placed on {
              (() => {
                try {
                  return format(new Date(order.createdAt), 'MMM dd, yyyy');
                } catch (e) {
                  console.error("Date parsing error:", e);
                  return "Invalid date";
                }
              })()
            }</CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                order.isDelivered 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {order.isDelivered ? <Check className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                {order.isDelivered ? 'Delivered' : 'Processing'}
              </span>
            </div>
            <p className="text-sm font-medium mt-1">Total: ${order.totalPrice.toFixed(2)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Items</h4>
            <div className="space-y-3">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Shipping Address</h4>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                {order.shippingAddress.address}<br />
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Order Summary</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>${(order.totalPrice - order.taxPrice - order.shippingPrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping:</span>
                  <span>${order.shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax:</span>
                  <span>${order.taxPrice.toFixed(2)}</span>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 pt-3 px-4 pb-4">
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Package className="h-4 w-4 mr-1" />
            {order.isDelivered ? (
              <span>Delivered on {
                (() => {
                  try {
                    return format(new Date(order.deliveredAt), 'MMM dd, yyyy');
                  } catch (e) {
                    console.error("Date parsing error:", e);
                    return "Invalid date";
                  }
                })()
              }</span>
            ) : (
              <span>Expected delivery within 5-7 business days</span>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(order)}
          >
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Orders; 