import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Package, 
  Users, 
  ShoppingBag, 
  TrendingUp,
  Search,
  FileImage,
  Upload,
  Check,
  Clock,
  MoreHorizontal,
  RefreshCw,
  X,
  Mail,
  User,
  Shield,
  CalendarDays,
  Store,
  Truck,
  CreditCard,
  Globe,
  Phone,
  MapPin,
  Save,
  Facebook,
  Twitter,
  Instagram
} from 'lucide-react';

import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';

// Import API functions
import { getProducts, createProduct, updateProduct, deleteProduct, getAdminStats, uploadProductImage, getAdminOrders, updateOrderToDelivered, getAdminUsers, getStoreSettings, updateStoreSettings } from '@/lib/api';

// Define order interface types
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

interface User {
  _id: string;
  name: string;
  email: string;
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
  paidAt: string | null;
  isDelivered: boolean;
  deliveredAt: string | null;
  createdAt: string;
  user: User;
}

// Add a new interface for the selected order
interface SelectedOrder extends Order {
  isViewDialogOpen: boolean;
}

// Define user interface type
interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  wishlist: string[];
  cart: any[];
}

// Define store settings interface
interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeLogo: string;
  storeAddress: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  shipping: {
    domesticRate: number;
    internationalRate: number;
    freeShippingThreshold: number;
  };
  payment: {
    acceptedMethods: string[];
    currency: string;
    taxRate: number;
  };
}

const Admin = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<SelectedOrder | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    userCount: 0,
    productCount: 0,
    orderCount: 0,
    pendingOrderCount: 0,
    revenueChangePercent: 0
  });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsEdited, setSettingsEdited] = useState(false);
  
  // File input refs
  const addFrontImageInputRef = useRef(null);
  const addBackImageInputRef = useRef(null);
  const editFrontImageInputRef = useRef(null);
  const editBackImageInputRef = useRef(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [frontImageUploading, setFrontImageUploading] = useState(false);
  const [backImageUploading, setBackImageUploading] = useState(false);
  const [editFrontImageUploading, setEditFrontImageUploading] = useState(false);
  const [editBackImageUploading, setEditBackImageUploading] = useState(false);
  
  // Image preview states
  const [frontImagePreview, setFrontImagePreview] = useState(null);
  const [backImagePreview, setBackImagePreview] = useState(null);
  const [editFrontImagePreview, setEditFrontImagePreview] = useState(null);
  const [editBackImagePreview, setEditBackImagePreview] = useState(null);
  
  // Handle image file selection for preview
  const handleImageChange = (e, setPreviewFunc) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewFunc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: 'Error',
          description: 'Failed to load products',
          variant: 'destructive'
        });
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [toast]);
  
  // Fetch admin stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      
      try {
        const statsData = await getAdminStats(token);
        setStats({
          totalRevenue: statsData.totalRevenue || 0,
          userCount: statsData.userCount || 0,
          productCount: statsData.productCount || 0,
          orderCount: statsData.orderCount || 0,
          pendingOrderCount: statsData.pendingOrderCount || 0,
          revenueChangePercent: statsData.revenueChangePercent || 0
        });
        setStatsLoading(false);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        setStatsLoading(false);
      }
    };
    
    fetchStats();
  }, [token]);

  // Fetch orders for admin
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      
      try {
        const ordersData = await getAdminOrders(token);
        setOrders(ordersData);
        setOrdersLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: 'Error',
          description: 'Failed to load orders',
          variant: 'destructive'
        });
        setOrdersLoading(false);
      }
    };
    
    fetchOrders();
  }, [token, toast]);
  
  // Fetch users for admin
  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      
      try {
        const usersData = await getAdminUsers(token);
        setUsers(usersData);
        setUsersLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: 'Error',
          description: 'Failed to load users',
          variant: 'destructive'
        });
        setUsersLoading(false);
      }
    };
    
    fetchUsers();
  }, [token, toast]);
  
  // Fetch store settings
  useEffect(() => {
    const fetchSettings = async () => {
      if (!token) return;
      
      try {
        const settingsData = await getStoreSettings(token);
        setStoreSettings(settingsData);
        setSettingsLoading(false);
      } catch (error) {
        console.error('Error fetching store settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load store settings',
          variant: 'destructive'
        });
        setSettingsLoading(false);
      }
    };
    
    fetchSettings();
  }, [token, toast]);
  
  // Check if user is admin, if not redirect to home page
  if (!user || user.role !== 'admin') {
    toast({
      title: 'Access Denied',
      description: 'You do not have permission to access this page',
      variant: 'destructive'
    });
    return <Navigate to="/" />;
  }
  
  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearchQuery.toLowerCase())
  );
  
  // Handle image upload for a product
  const handleImageUpload = async (file, productId, imageIndex = 0, setUploadingState = setImageUploading) => {
    if (!file) return null;
    
    try {
      setUploadingState(true);
      
      // Log upload attempt for debugging
      console.log('Attempting to upload image for product:', productId, 'at index:', imageIndex);
      console.log('File details:', { name: file.name, type: file.type, size: file.size });
      
      // Call the API with image index parameter
      const result = await uploadProductImage(file, productId, token, imageIndex);
      console.log('Upload response:', result);
      
      // Update the product in the state with the new image
      if (result.success && result.product) {
        setProducts(products.map(p => 
          p._id === result.product._id ? result.product : p
        ));
        
        // If this is the currently selected product, update it
        if (selectedProduct && selectedProduct._id === productId) {
          setSelectedProduct(result.product);
        }
        
        toast({
          title: 'Success',
          description: 'Image uploaded successfully',
        });
        
        return result;
      } else if (result.success && result.imageUrl) {
        // If we got imageUrl but no product (should not happen)
        toast({
          title: 'Success',
          description: 'Image uploaded but product was not updated',
        });
        
        return result;
      } else {
        // Something unexpected happened
        toast({
          title: 'Warning',
          description: 'Unexpected response from server',
          variant: 'destructive'
        });
        
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload image',
        variant: 'destructive'
      });
      
      return null;
    } finally {
      setUploadingState(false);
    }
  };
  
  // Function to reset image states
  const resetImageStates = () => {
    setFrontImagePreview(null);
    setBackImagePreview(null);
    setEditFrontImagePreview(null);
    setEditBackImagePreview(null);
  };
  
  // Handle adding a product
  const handleAddProduct = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    // Check if both image inputs have files
    const frontImageInput = addFrontImageInputRef.current;
    const backImageInput = addBackImageInputRef.current;
    
    if (!frontImageInput?.files?.[0] || !backImageInput?.files?.[0]) {
      toast({
        title: 'Error',
        description: 'Both front and back images are required',
        variant: 'destructive'
      });
      return;
    }
    
    const productData = {
      productId: formData.get('productId')?.toString() || '',
      name: formData.get('name')?.toString() || '',
      price: parseFloat(formData.get('price')?.toString() || '0'),
      countInStock: parseInt(formData.get('countInStock')?.toString() || '0'),
      category: formData.get('category')?.toString() || '',
      description: formData.get('description')?.toString() || '',
      culture: formData.get('culture')?.toString() || 'Tokyo', // Default culture
      images: [], // Start with empty images array, we'll add them after upload
    };
    
    try {
      // Create product first
      const newProduct = await createProduct(productData, token);
      
      // Upload front and back images sequentially
      console.log('Uploading front image...');
      const frontResult = await handleImageUpload(frontImageInput.files[0], newProduct._id, 0, setFrontImageUploading);
      
      console.log('Uploading back image...');
      const backResult = await handleImageUpload(backImageInput.files[0], newProduct._id, 1, setBackImageUploading);
      
      // Get the updated product with both images
      if (frontResult?.product && backResult?.product) {
        // Use the product from the last upload as it should contain both images
        setProducts([...products, backResult.product]);
      } else {
        // Fallback to refreshing products from server
        const updatedProducts = await getProducts();
        setProducts(updatedProducts);
      }
      
      setIsAddDialogOpen(false);
      // Reset image previews after successful upload
      resetImageStates();
      
      toast({
        title: 'Success',
        description: 'Product added successfully with front and back images',
      });
      
      // Update product count in stats
      setStats(prev => ({
        ...prev,
        productCount: prev.productCount + 1
      }));
      
      // Reset the form
      event.target.reset();
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: 'Error',
        description: 'Failed to add product: ' + (error.message || 'Unknown error'),
        variant: 'destructive'
      });
    }
  };
  
  // Handle form submission for editing a product
  const handleEditProduct = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const productData = {
      name: formData.get('name')?.toString() || '',
      price: parseFloat(formData.get('price')?.toString() || '0'),
      countInStock: parseInt(formData.get('countInStock')?.toString() || '0'),
      category: formData.get('category')?.toString() || '',
      description: formData.get('description')?.toString() || '',
      // Keep existing values for other fields
      culture: selectedProduct.culture,
      images: selectedProduct.images
    };
    
    try {
      const updatedProduct = await updateProduct(selectedProduct._id, productData, token);
      setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      resetImageStates();
      
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive'
      });
    }
  };
  
  // Handle deleting a product
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId, token);
        setProducts(products.filter(p => p._id !== productId));
        toast({
          title: 'Success',
          description: 'Product deleted successfully',
        });
        
        // Update product count in stats
        setStats(prev => ({
          ...prev,
          productCount: prev.productCount - 1
        }));
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete product',
          variant: 'destructive'
        });
      }
    }
  };

  // Handle mark as delivered
  const handleMarkDelivered = async (orderId: string) => {
    try {
      await updateOrderToDelivered(orderId, token);
      
      // Update orders list
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, isDelivered: true, deliveredAt: new Date().toISOString() } 
          : order
      ));
      
      toast({
        title: 'Success',
        description: 'Order marked as delivered',
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive'
      });
    }
  };

  // Function to handle opening order details dialog
  const handleViewOrderDetails = (order: Order) => {
    console.log("Opening order details for:", order._id);
    setSelectedOrder({ ...order, isViewDialogOpen: true });
  };
  
  // Handle store settings update
  const handleUpdateSettings = async (event) => {
    event.preventDefault();
    
    if (!token || !storeSettings) return;
    
    try {
      const formData = new FormData(event.target);
      
      // Build settings object from form data
      const updatedSettings = {
        storeName: formData.get('storeName'),
        storeEmail: formData.get('storeEmail'),
        storePhone: formData.get('storePhone'),
        storeLogo: storeSettings.storeLogo, // Keep existing logo
        storeAddress: formData.get('storeAddress'),
        socialLinks: {
          facebook: formData.get('facebook'),
          instagram: formData.get('instagram'),
          twitter: formData.get('twitter')
        },
        shipping: {
          domesticRate: parseFloat(formData.get('domesticRate') as string),
          internationalRate: parseFloat(formData.get('internationalRate') as string),
          freeShippingThreshold: parseFloat(formData.get('freeShippingThreshold') as string)
        },
        payment: {
          acceptedMethods: Array.from(formData.getAll('paymentMethods')),
          currency: formData.get('currency'),
          taxRate: parseFloat(formData.get('taxRate') as string)
        }
      };
      
      const result = await updateStoreSettings(updatedSettings, token);
      
      if (result.success) {
        toast({
          title: 'Settings Saved',
          description: 'Your store settings have been saved to the database.',
          variant: 'default',
        });
        setStoreSettings(result.data);
        setSettingsEdited(false);
      }
    } catch (error) {
      console.error('Error updating store settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update store settings. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <section className="py-8 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your store, products, and users</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8 w-[200px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog 
                open={isAddDialogOpen} 
                onOpenChange={(open) => {
                  setIsAddDialogOpen(open);
                  if (!open) resetImageStates();
                }}
              >
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                      Fill out the form below to add a new product to your inventory.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddProduct}>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="productId">Product ID (Required)</Label>
                        <Input id="productId" name="productId" placeholder="Enter a unique product identifier" required />
                        <p className="text-xs text-muted-foreground mt-1">
                          This ID must be unique and will be used for inventory management
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Product Name</Label>
                          <Input id="name" name="name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price">Price ($)</Label>
                          <Input id="price" name="price" type="number" step="0.01" min="0" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="countInStock">Quantity in Stock</Label>
                          <Input id="countInStock" name="countInStock" type="number" min="0" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <select id="category" name="category" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required>
                            <option value="">Select a category</option>
                            <option value="fashion">Fashion</option>
                            <option value="music">Music</option>
                            <option value="accessories">Accessories</option>
                            <option value="footwear">Footwear</option>
                            
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="culture">Culture</Label>
                        <select id="culture" name="culture" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required>
                          <option value="Tokyo">Tokyo</option>
                          <option value="New York">New York</option>
                          <option value="Lagos">Lagos</option>
                          <option value="Seoul">Seoul</option>
                          <option value="London">London</option>
                          <option value="Berlin">Berlin</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" rows={4} required />
                      </div>
                      
                      {/* Front Image Upload */}
                      <div className="space-y-2">
                        <Label htmlFor="frontImage" className="block">Front View Image (Required)</Label>
                        <div className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                          <input 
                            type="file" 
                            id="frontImage" 
                            ref={addFrontImageInputRef}
                            className="hidden" 
                            accept="image/*"
                            required
                            onChange={(e) => handleImageChange(e, setFrontImagePreview)}
                          />
                          {frontImagePreview ? (
                            <div className="relative">
                              <img 
                                src={frontImagePreview} 
                                alt="Front view preview" 
                                className="mx-auto max-h-60 object-contain rounded-md mb-2"
                              />
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                className="mt-2 text-sm"
                                onClick={() => addFrontImageInputRef.current?.click()}
                              >
                                Change Image
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              type="button" 
                              variant="ghost" 
                              className="w-full h-full flex flex-col items-center"
                              onClick={() => addFrontImageInputRef.current?.click()}
                              disabled={frontImageUploading}
                            >
                              {frontImageUploading ? (
                                <div className="h-6 w-6 border-2 border-current border-t-transparent rounded-full animate-spin mb-2"></div>
                              ) : (
                                <FileImage className="h-6 w-6 mb-2 text-muted-foreground" />
                              )}
                              <p className="text-sm text-muted-foreground">
                                {frontImageUploading ? 'Uploading...' : 'Click to upload front view image'}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                This will be the main product image
                              </p>
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Back Image Upload */}
                      <div className="space-y-2">
                        <Label htmlFor="backImage" className="block">Back View Image (Required)</Label>
                        <div className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                          <input 
                            type="file" 
                            id="backImage" 
                            ref={addBackImageInputRef}
                            className="hidden" 
                            accept="image/*"
                            required
                            onChange={(e) => handleImageChange(e, setBackImagePreview)}
                          />
                          {backImagePreview ? (
                            <div className="relative">
                              <img 
                                src={backImagePreview} 
                                alt="Back view preview" 
                                className="mx-auto max-h-60 object-contain rounded-md mb-2"
                              />
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                className="mt-2 text-sm"
                                onClick={() => addBackImageInputRef.current?.click()}
                              >
                                Change Image
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              type="button" 
                              variant="ghost" 
                              className="w-full h-full flex flex-col items-center"
                              onClick={() => addBackImageInputRef.current?.click()}
                              disabled={backImageUploading}
                            >
                              {backImageUploading ? (
                                <div className="h-6 w-6 border-2 border-current border-t-transparent rounded-full animate-spin mb-2"></div>
                              ) : (
                                <FileImage className="h-6 w-6 mb-2 text-muted-foreground" />
                              )}
                              <p className="text-sm text-muted-foreground">
                                {backImageUploading ? 'Uploading...' : 'Click to upload back view image'}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                This will show when customers hover over the product
                              </p>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="mt-6 sticky bottom-0 bg-background pb-2 pt-4">
                      <Button variant="outline" onClick={() => {
                        setIsAddDialogOpen(false);
                        resetImageStates();
                      }}>Cancel</Button>
                      <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                        Save Product
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="grid gap-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {statsLoading ? (
                        <div className="h-7 w-24 bg-muted animate-pulse rounded"></div>
                      ) : (
                        `$${stats.totalRevenue.toFixed(2)}`
                      )}
                    </div>
                    <div className="p-2 bg-primary/10 rounded-full">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {statsLoading ? (
                      <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                    ) : (
                      <span className={stats.revenueChangePercent >= 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                        {stats.revenueChangePercent >= 0 ? "+" : ""}{stats.revenueChangePercent.toFixed(1)}%
                      </span>
                    )}
                    {!statsLoading && " from last month"}
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {statsLoading ? (
                        <div className="h-7 w-16 bg-muted animate-pulse rounded"></div>
                      ) : (
                        stats.productCount
                      )}
                    </div>
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                      <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Manage all your products
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {statsLoading ? (
                        <div className="h-7 w-16 bg-muted animate-pulse rounded"></div>
                      ) : (
                        stats.orderCount
                      )}
                    </div>
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <ShoppingBag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {statsLoading ? (
                      <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                    ) : (
                      <span className="text-blue-500 font-medium">{stats.pendingOrderCount} pending</span>
                    )}
                    {!statsLoading && " orders"}
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {statsLoading ? (
                        <div className="h-7 w-16 bg-muted animate-pulse rounded"></div>
                      ) : (
                        stats.userCount
                      )}
                    </div>
                    <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-full">
                      <Users className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Active customer accounts
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Tabs defaultValue="products" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products" className="space-y-4">
              <h2 className="text-xl font-semibold">Product Management</h2>
              <p className="text-muted-foreground mb-4">Manage your product inventory, add new products, or update existing ones.</p>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <div className="bg-card rounded-lg shadow overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            {products.length === 0 
                              ? 'No products in the database. Add your first product!' 
                              : 'No products found that match your search criteria.'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProducts.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell>
                              <div className="h-12 w-12 rounded-md overflow-hidden border border-border bg-muted flex items-center justify-center">
                                {product.images && product.images[0] ? (
                                  <img 
                                    src={product.images[0]} 
                                    alt={product.name} 
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <FileImage className="h-6 w-6 text-muted-foreground" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span>{product.name}</span>
                                <span className="text-xs text-muted-foreground truncate max-w-[250px]">
                                  {product.description && product.description.length > 60 
                                    ? `${product.description.substring(0, 60)}...` 
                                    : product.description}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {product.category || 'Uncategorized'}
                              </Badge>
                            </TableCell>
                            <TableCell>${product.price?.toFixed(2) || '0.00'}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded text-xs ${
                                (product.countInStock || 0) > 10 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                  : (product.countInStock || 0) > 0 
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' 
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {(product.countInStock || 0) > 0 ? product.countInStock : 'Out of stock'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setIsEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => handleDeleteProduct(product._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="orders" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Order Management</h2>
                  <p className="text-muted-foreground">View and manage customer orders</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    setOrdersLoading(true);
                    const fetchOrders = async () => {
                      try {
                        const ordersData = await getAdminOrders(token);
                        setOrders(ordersData);
                      } catch (error) {
                        console.error('Error refreshing orders:', error);
                        toast({
                          title: 'Error',
                          description: 'Failed to refresh orders',
                          variant: 'destructive'
                        });
                      } finally {
                        setOrdersLoading(false);
                      }
                    };
                    fetchOrders();
                  }}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
              
              {ordersLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : orders.length === 0 ? (
              <div className="bg-card p-8 rounded-lg shadow text-center">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    There are no customer orders in the system yet.
                  </p>
              </div>
              ) : (
                <div className="bg-card rounded-lg border shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-medium">#{order._id.slice(-6)}</TableCell>
                          <TableCell>
                            {order.user && order.user.name ? (
                              <div className="flex flex-col">
                                <span>{order.user.name}</span>
                                <span className="text-xs text-muted-foreground">{order.user.email}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Guest</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {(() => {
                              try {
                                return format(new Date(order.createdAt), 'MMM dd, yyyy');
                              } catch (e) {
                                console.error("Date parsing error:", e);
                                return "Invalid date";
                              }
                            })()}
                          </TableCell>
                          <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.isDelivered 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              }`}>
                                {order.isDelivered ? (
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
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => {
                                  // View order details - open dialog
                                  handleViewOrderDetails(order);
                                }}>
                                  View details
                                </DropdownMenuItem>
                                {!order.isDelivered && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleMarkDelivered(order._id)}>
                                      Mark as delivered
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="customers" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Customer Management</h2>
                  <p className="text-muted-foreground">View and manage registered users</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search customers..."
                      className="pl-8 w-[250px]"
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {
                    setUsersLoading(true);
                    const fetchUsers = async () => {
                      try {
                        const usersData = await getAdminUsers(token);
                        setUsers(usersData);
                      } catch (error) {
                        console.error('Error refreshing users:', error);
                        toast({
                          title: 'Error',
                          description: 'Failed to refresh users',
                          variant: 'destructive'
                        });
                      } finally {
                        setUsersLoading(false);
                      }
                    };
                    fetchUsers();
                  }}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
              
              {usersLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : users.length === 0 ? (
              <div className="bg-card p-8 rounded-lg shadow text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Customers Found</h3>
                  <p className="text-muted-foreground mb-4">There are no registered users in the system yet.</p>
              </div>
              ) : (
                <div className="bg-card rounded-lg border shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Wishlist</TableHead>
                        <TableHead>Cart</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((customer) => (
                        <TableRow key={customer._id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-full bg-culture text-culture-foreground flex items-center justify-center flex-shrink-0">
                                <User className="h-5 w-5" />
                              </div>
                              <div className="font-medium">{customer.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{customer.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                customer.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' 
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              }`}>
                                {customer.role === 'admin' ? (
                                  <>
                                    <Shield className="h-3 w-3 mr-1" />
                                    Admin
                                  </>
                                ) : (
                                  <>
                                    <User className="h-3 w-3 mr-1" />
                                    Customer
                                  </>
                                )}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <CalendarDays className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {(() => {
                                  try {
                                    return format(new Date(customer.createdAt), 'MMM dd, yyyy');
                                  } catch (e) {
                                    return "Invalid date";
                                  }
                                })()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {customer.wishlist?.length || 0} items
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {customer.cart?.length || 0} items
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="settings">
              <h2 className="text-xl font-semibold">Store Settings</h2>
              <p className="text-muted-foreground mb-6">Configure your store information, shipping options, and payment settings.</p>
              
              {settingsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : storeSettings ? (
                <form onSubmit={handleUpdateSettings} onChange={() => setSettingsEdited(true)}>
                  <div className="grid gap-6 mb-8">
                    {/* Store Information */}
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Store className="h-5 w-5 text-primary" />
                          <CardTitle>Store Information</CardTitle>
                        </div>
                        <CardDescription>
                          Basic information about your store
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="storeName">Store Name</Label>
                            <Input 
                              id="storeName" 
                              name="storeName" 
                              defaultValue={storeSettings.storeName}
                              required 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="storeEmail">Store Email</Label>
                            <div className="flex">
                              <div className="flex items-center px-3 bg-muted rounded-l-md border border-r-0 border-input">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <Input 
                                id="storeEmail" 
                                name="storeEmail" 
                                type="email"
                                className="rounded-l-none"
                                defaultValue={storeSettings.storeEmail}
                                required 
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="storePhone">Store Phone</Label>
                            <div className="flex">
                              <div className="flex items-center px-3 bg-muted rounded-l-md border border-r-0 border-input">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <Input 
                                id="storePhone" 
                                name="storePhone" 
                                className="rounded-l-none"
                                defaultValue={storeSettings.storePhone}
                                required 
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="storeAddress">Store Address</Label>
                            <div className="flex">
                              <div className="flex items-center px-3 bg-muted rounded-l-md border border-r-0 border-input">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <Input 
                                id="storeAddress" 
                                name="storeAddress" 
                                className="rounded-l-none"
                                defaultValue={storeSettings.storeAddress}
                                required 
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Social Media Links */}
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-blue-500" />
                          <CardTitle>Social Media</CardTitle>
                        </div>
                        <CardDescription>
                          Your store's presence on social media platforms
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="space-y-2">
                            <Label htmlFor="facebook">Facebook</Label>
                            <div className="flex">
                              <div className="flex items-center px-3 bg-muted rounded-l-md border border-r-0 border-input">
                                <Facebook className="h-4 w-4 text-blue-600" />
                              </div>
                              <Input 
                                id="facebook" 
                                name="facebook" 
                                className="rounded-l-none"
                                defaultValue={storeSettings.socialLinks.facebook}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="instagram">Instagram</Label>
                            <div className="flex">
                              <div className="flex items-center px-3 bg-muted rounded-l-md border border-r-0 border-input">
                                <Instagram className="h-4 w-4 text-pink-600" />
                              </div>
                              <Input 
                                id="instagram" 
                                name="instagram" 
                                className="rounded-l-none"
                                defaultValue={storeSettings.socialLinks.instagram}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="twitter">Twitter</Label>
                            <div className="flex">
                              <div className="flex items-center px-3 bg-muted rounded-l-md border border-r-0 border-input">
                                <Twitter className="h-4 w-4 text-blue-400" />
                              </div>
                              <Input 
                                id="twitter" 
                                name="twitter" 
                                className="rounded-l-none"
                                defaultValue={storeSettings.socialLinks.twitter}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Shipping Settings */}
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Truck className="h-5 w-5 text-green-500" />
                          <CardTitle>Shipping Settings</CardTitle>
                        </div>
                        <CardDescription>
                          Configure shipping rates and options
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="space-y-2">
                            <Label htmlFor="domesticRate">Domestic Shipping Rate ($)</Label>
                            <Input 
                              id="domesticRate" 
                              name="domesticRate" 
                              type="number"
                              step="0.01"
                              min="0"
                              defaultValue={storeSettings.shipping.domesticRate}
                              required 
                            />
                            <p className="text-xs text-muted-foreground">Base rate for domestic shipping</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="internationalRate">International Shipping Rate ($)</Label>
                            <Input 
                              id="internationalRate" 
                              name="internationalRate" 
                              type="number"
                              step="0.01"
                              min="0"
                              defaultValue={storeSettings.shipping.internationalRate}
                              required 
                            />
                            <p className="text-xs text-muted-foreground">Base rate for international shipping</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="freeShippingThreshold">Free Shipping Threshold ($)</Label>
                            <Input 
                              id="freeShippingThreshold" 
                              name="freeShippingThreshold" 
                              type="number"
                              step="0.01"
                              min="0"
                              defaultValue={storeSettings.shipping.freeShippingThreshold}
                              required 
                            />
                            <p className="text-xs text-muted-foreground">Order amount for free shipping eligibility</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Payment Settings */}
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-violet-500" />
                          <CardTitle>Payment Settings</CardTitle>
                        </div>
                        <CardDescription>
                          Configure payment options and taxes
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-3">
                            <Label>Accepted Payment Methods</Label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="checkbox" 
                                  id="credit_card" 
                                  name="paymentMethods" 
                                  value="credit_card"
                                  defaultChecked={storeSettings.payment.acceptedMethods.includes('credit_card')}
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <Label htmlFor="credit_card" className="font-normal">Credit Card</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="checkbox" 
                                  id="paypal" 
                                  name="paymentMethods" 
                                  value="paypal"
                                  defaultChecked={storeSettings.payment.acceptedMethods.includes('paypal')}
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <Label htmlFor="paypal" className="font-normal">PayPal</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="checkbox" 
                                  id="bank_transfer" 
                                  name="paymentMethods" 
                                  value="bank_transfer"
                                  defaultChecked={storeSettings.payment.acceptedMethods.includes('bank_transfer')}
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <Label htmlFor="bank_transfer" className="font-normal">Bank Transfer</Label>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="currency">Currency</Label>
                              <select
                                id="currency"
                                name="currency"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                defaultValue={storeSettings.payment.currency}
                                required
                              >
                                <option value="USD">USD - US Dollar</option>
                                <option value="EUR">EUR - Euro</option>
                                <option value="GBP">GBP - British Pound</option>
                                <option value="CAD">CAD - Canadian Dollar</option>
                                <option value="AUD">AUD - Australian Dollar</option>
                                <option value="JPY">JPY - Japanese Yen</option>
                              </select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="taxRate">Tax Rate (%)</Label>
                              <Input 
                                id="taxRate" 
                                name="taxRate" 
                                type="number"
                                step="0.1"
                                min="0"
                                max="100"
                                defaultValue={storeSettings.payment.taxRate}
                                required 
                              />
                              <p className="text-xs text-muted-foreground">Sales tax or VAT percentage</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={!settingsEdited} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Settings
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="bg-card p-8 rounded-lg shadow text-center">
                  <p className="text-muted-foreground mb-4">Error loading settings. Please try refreshing the page.</p>
                  <Button onClick={() => window.location.reload()} variant="outline">Refresh</Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {/* Edit Product Dialog */}
          {selectedProduct && (
            <Dialog 
              open={isEditDialogOpen} 
              onOpenChange={(open) => {
                setIsEditDialogOpen(open);
                if (!open) {
                  setSelectedProduct(null);
                  resetImageStates();
                }
              }}
            >
              <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Product</DialogTitle>
                  <DialogDescription>
                    Update the product information below.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEditProduct}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-productId">Product ID</Label>
                      <Input
                        id="edit-productId"
                        name="productId"
                        defaultValue={selectedProduct.productId}
                        disabled  // Make it read-only in edit mode to prevent changing the ID
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Product ID cannot be changed after creation
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Product Name</Label>
                        <Input
                          id="edit-name"
                          name="name"
                          defaultValue={selectedProduct.name}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-price">Price ($)</Label>
                        <Input
                          id="edit-price"
                          name="price"
                          type="number"
                          step="0.01"
                          min="0"
                          defaultValue={selectedProduct.price}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-countInStock">Quantity in Stock</Label>
                        <Input
                          id="edit-countInStock"
                          name="countInStock"
                          type="number"
                          min="0"
                          defaultValue={selectedProduct.countInStock || 0}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-category">Category</Label>
                        <select
                          id="edit-category"
                          name="category"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          defaultValue={selectedProduct.category}
                          required
                        >
                          <option value="fashion">Fashion</option>
                          <option value="music">Music</option>
                          <option value="accessories">Accessories</option>
                          <option value="footwear">Footwear</option>
                          
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        name="description"
                        defaultValue={selectedProduct.description}
                        rows={4}
                        required
                      />
                    </div>
                    
                    {/* Front Image Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="editFrontImage" className="block">Front View Image</Label>
                      <div className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                        <input 
                          type="file" 
                          id="editFrontImage" 
                          ref={editFrontImageInputRef}
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            handleImageChange(e, setEditFrontImagePreview);
                            if (e.target.files && e.target.files[0]) {
                              handleImageUpload(e.target.files[0], selectedProduct._id, 0, setEditFrontImageUploading);
                            }
                          }}
                        />
                        {editFrontImagePreview ? (
                          <div className="relative">
                            <img 
                              src={editFrontImagePreview} 
                              alt="Front view preview" 
                              className="mx-auto max-h-60 object-contain rounded-md mb-2"
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              className="mt-2 text-sm"
                              onClick={() => editFrontImageInputRef.current?.click()}
                              disabled={editFrontImageUploading}
                            >
                              {editFrontImageUploading ? 'Uploading...' : 'Change Image'}
                            </Button>
                          </div>
                        ) : selectedProduct?.images && selectedProduct.images[0] ? (
                          <div className="relative">
                            <img 
                              src={selectedProduct.images[0]} 
                              alt={selectedProduct.name} 
                              className="mx-auto max-h-60 object-contain rounded-md mb-2"
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              className="mt-2 text-sm"
                              onClick={() => editFrontImageInputRef.current?.click()}
                              disabled={editFrontImageUploading}
                            >
                              {editFrontImageUploading ? 'Uploading...' : 'Change Image'}
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            className="w-full h-full flex flex-col items-center"
                            onClick={() => editFrontImageInputRef.current?.click()}
                            disabled={editFrontImageUploading}
                          >
                            {editFrontImageUploading ? (
                              <div className="h-6 w-6 border-2 border-current border-t-transparent rounded-full animate-spin mb-2"></div>
                            ) : (
                              <FileImage className="h-6 w-6 mb-2 text-muted-foreground" />
                            )}
                            <p className="text-sm text-muted-foreground">
                              {editFrontImageUploading ? 'Uploading...' : 'Click to upload front view image'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              This will be the main product image
                            </p>
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {/* Back Image Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="editBackImage" className="block">Back View Image</Label>
                      <div className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                        <input 
                          type="file" 
                          id="editBackImage" 
                          ref={editBackImageInputRef}
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            handleImageChange(e, setEditBackImagePreview);
                            if (e.target.files && e.target.files[0]) {
                              handleImageUpload(e.target.files[0], selectedProduct._id, 1, setEditBackImageUploading);
                            }
                          }}
                        />
                        {editBackImagePreview ? (
                          <div className="relative">
                            <img 
                              src={editBackImagePreview} 
                              alt="Back view preview" 
                              className="mx-auto max-h-60 object-contain rounded-md mb-2"
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              className="mt-2 text-sm"
                              onClick={() => editBackImageInputRef.current?.click()}
                              disabled={editBackImageUploading}
                            >
                              {editBackImageUploading ? 'Uploading...' : 'Change Image'}
                            </Button>
                          </div>
                        ) : selectedProduct?.images && selectedProduct.images[1] ? (
                          <div className="relative">
                            <img 
                              src={selectedProduct.images[1]} 
                              alt={`${selectedProduct.name} back view`} 
                              className="mx-auto max-h-60 object-contain rounded-md mb-2"
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              className="mt-2 text-sm"
                              onClick={() => editBackImageInputRef.current?.click()}
                              disabled={editBackImageUploading}
                            >
                              {editBackImageUploading ? 'Uploading...' : 'Change Image'}
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            className="w-full h-full flex flex-col items-center"
                            onClick={() => editBackImageInputRef.current?.click()}
                            disabled={editBackImageUploading}
                          >
                            {editBackImageUploading ? (
                              <div className="h-6 w-6 border-2 border-current border-t-transparent rounded-full animate-spin mb-2"></div>
                            ) : (
                              <FileImage className="h-6 w-6 mb-2 text-muted-foreground" />
                            )}
                            <p className="text-sm text-muted-foreground">
                              {editBackImageUploading ? 'Uploading...' : 'Click to upload back view image'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              This will show when customers hover over the product
                            </p>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="mt-6 sticky bottom-0 bg-background pb-2 pt-4">
                    <Button variant="outline" onClick={() => {
                      setIsEditDialogOpen(false);
                      setSelectedProduct(null);
                      resetImageStates();
                    }}>Cancel</Button>
                    <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                      Update Product
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
          
          {/* Order Details Dialog */}
          {selectedOrder && (
            <Dialog 
              open={selectedOrder.isViewDialogOpen} 
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
                  <DialogDescription>
                    Placed on {
                      (() => {
                        try {
                          return format(new Date(selectedOrder.createdAt), 'MMM dd, yyyy');
                        } catch (e) {
                          return "Invalid date";
                        }
                      })()
                    }
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Customer Information */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Customer Information</h3>
                    <div className="rounded-md bg-muted p-3">
                      {selectedOrder.user && selectedOrder.user.name ? (
                        <>
                          <p><span className="font-medium">Name:</span> {selectedOrder.user.name}</p>
                          <p><span className="font-medium">Email:</span> {selectedOrder.user.email}</p>
                        </>
                      ) : (
                        <p>Guest Customer</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Shipping Address</h3>
                    <div className="rounded-md bg-muted p-3">
                      {selectedOrder.shippingAddress && (
                        <>
                          <p>{selectedOrder.shippingAddress.firstName || ''} {selectedOrder.shippingAddress.lastName || ''}</p>
                          <p>{selectedOrder.shippingAddress.address || ''}</p>
                          <p>{selectedOrder.shippingAddress.city || ''}, {selectedOrder.shippingAddress.state || ''} {selectedOrder.shippingAddress.postalCode || ''}</p>
                          <p>{selectedOrder.shippingAddress.country || ''}</p>
                          {selectedOrder.shippingAddress.phone && <p><span className="font-medium">Phone:</span> {selectedOrder.shippingAddress.phone}</p>}
                          {selectedOrder.shippingAddress.email && <p><span className="font-medium">Email:</span> {selectedOrder.shippingAddress.email}</p>}
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Order Items</h3>
                    <div className="rounded-md border">
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
                                    {item.selectedSize && <p className="text-xs text-muted-foreground">Size: {item.selectedSize}</p>}
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
                  
                  {/* Order Summary */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Order Summary</h3>
                    <div className="rounded-md bg-muted p-3 space-y-1">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${(selectedOrder.totalPrice - selectedOrder.taxPrice - selectedOrder.shippingPrice).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>${selectedOrder.shippingPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>${selectedOrder.taxPrice.toFixed(2)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>${selectedOrder.totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="pt-2 text-sm text-muted-foreground">
                        <span>Payment Method: {selectedOrder.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Package className="h-4 w-4 mr-1" />
                    {selectedOrder.isDelivered ? (
                      <span>Delivered on {
                        (() => {
                          try {
                            return format(new Date(selectedOrder.deliveredAt || new Date()), 'MMM dd, yyyy');
                          } catch (e) {
                            return "Invalid date";
                          }
                        })()
                      }</span>
                    ) : (
                      <span>Expected delivery within 5-7 business days</span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                      Close
                    </Button>
                    {!selectedOrder.isDelivered && (
                      <Button onClick={() => {
                        handleMarkDelivered(selectedOrder._id);
                        setSelectedOrder(null);
                      }}>
                        Mark as Delivered
                      </Button>
                    )}
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Admin; 
