import { useEffect, useState } from 'react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ArrowLeft, Eye, GripVertical, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, Reorder, useDragControls } from 'framer-motion';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Wishlist = () => {
  const { items, removeItem, clearWishlist, setItems, syncWithUser } = useWishlistStore();
  const { addItem } = useCartStore();
  const { user, token, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [reorderEnabled, setReorderEnabled] = useState(false);
  const [reorderItems, setReorderItems] = useState(items);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set page title
    document.title = "Wishlist | CultureDrop";
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // If user is authenticated, sync wishlist with server data
    const syncWishlistIfAuthenticated = async () => {
      if (isAuthenticated && token) {
        setIsLoading(true);
        try {
          await syncWithUser(token);
          console.log('Wishlist synced with server:', items);
          toast.success('Wishlist synced with your account');
        } catch (error) {
          console.error('Failed to load wishlist:', error);
          toast.error('Failed to load your wishlist');
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('User not authenticated, using local wishlist:', items);
      }
    };
    
    syncWishlistIfAuthenticated();
  }, [isAuthenticated, token, syncWithUser]);
  
  useEffect(() => {
    // Sync reorderItems with items when items change
    setReorderItems(items);
  }, [items]);

  const handleAddToCart = (product: any, selectedSize: string) => {
    addItem({
      ...product,
      selectedSize,
    });
    toast.success(`${product.name} (${selectedSize}) added to cart!`);
  };

  const handleRemoveFromWishlist = async (product: any) => {
    try {
      await removeItem(product.id, token);
      toast.success(`${product.name} removed from wishlist!`);
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };
  
  const handleViewProduct = (product: any) => {
    navigate(`/shop/product/${product.id}`);
  };
  
  const saveReorderedItems = () => {
    setItems(reorderItems);
    setReorderEnabled(false);
    toast.success('Wishlist order saved!');
  };

  // Content for unauthenticated users
  const unauthenticatedContent = (
    <div className="text-center py-6 mt-4 bg-muted/30 rounded-lg p-6">
      <div className="text-amber-600 dark:text-amber-400 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m10 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium mb-2">Your wishlist is temporary</h3>
      <p className="text-muted-foreground mb-4">
        Sign in to save your wishlist permanently and access it from any device.
      </p>
      <Button asChild>
        <Link to="/login">Sign In</Link>
      </Button>
    </div>
  );

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
            <h1 className="text-4xl font-bold">Wishlist</h1>
          </div>
          <p className="text-muted-foreground">Your saved items for future purchase</p>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4">Loading your wishlist...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-medium">Your wishlist is empty</h2>
              <p className="mt-2 text-muted-foreground">Start adding your favorite products</p>
              <Button className="mt-6" asChild>
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {!isAuthenticated && unauthenticatedContent}
              
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">
                  {items.length} {items.length === 1 ? 'Item' : 'Items'}
                </h2>
                <div className="flex gap-3">
                  {reorderEnabled ? (
                    <Button variant="default" onClick={saveReorderedItems}>
                      Save Order
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => setReorderEnabled(true)}>
                      Reorder Items
                    </Button>
                  )}
                  <Button variant="outline" onClick={clearWishlist}>
                    Clear Wishlist
                  </Button>
                </div>
              </div>

              {reorderEnabled ? (
                <Reorder.Group 
                  axis="y" 
                  values={reorderItems} 
                  onReorder={setReorderItems}
                  className="space-y-4"
                >
                  {reorderItems.map(product => (
                    <WishlistItemDraggable
                      key={product.id}
                      product={product}
                      handleRemoveFromWishlist={handleRemoveFromWishlist}
                      handleAddToCart={handleAddToCart}
                      handleViewProduct={handleViewProduct}
                    />
                  ))}
                </Reorder.Group>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map(product => (
                    <WishlistItem
                      key={product.id}
                      product={product}
                      handleRemoveFromWishlist={handleRemoveFromWishlist}
                      handleAddToCart={handleAddToCart}
                      handleViewProduct={handleViewProduct}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

const WishlistItem = ({ product, handleRemoveFromWishlist, handleAddToCart, handleViewProduct }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  // Validate product data - show error if critical data is missing
  if (!product || !product.id) {
    return (
      <div className="bg-card rounded-lg p-4 border border-red-300">
        <p className="text-red-500">Invalid product data</p>
        <Button 
          size="sm" 
          variant="destructive" 
          className="mt-2"
          onClick={() => handleRemoveFromWishlist({ id: product?.id || 'unknown', name: 'Unknown Product' })}
        >
          Remove Invalid Item
        </Button>
      </div>
    );
  }
  
  // Default sizes if the product doesn't specify any
  const sizes = product.sizes || ['S', 'M', 'L', 'XL'];
  
  // Ensure product has images
  const productImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/placeholder-product.jpg';

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setPopoverOpen(false); // Close the popover immediately after selection
  };

  return (
    <motion.div
      className="relative bg-card rounded-lg overflow-hidden shadow-sm border group hover:shadow-md transition-all cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div 
        className="relative aspect-square bg-secondary overflow-hidden"
        onClick={() => handleViewProduct(product)}
      >
        <img 
          src={productImage} 
          alt={product.name || 'Product image'} 
          className="w-full h-full object-cover object-center transition-transform group-hover:scale-105 duration-300"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            e.currentTarget.src = '/placeholder-product.jpg';
          }}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button 
            variant="secondary" 
            size="sm" 
            className="scale-90 group-hover:scale-100 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              handleViewProduct(product);
            }}
          >
            <Eye size={16} className="mr-2" />
            Quick View
          </Button>
        </div>
        <Button 
          size="icon" 
          variant="destructive" 
          className="absolute top-2 right-2 scale-90 group-hover:scale-100 transition-transform"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveFromWishlist(product);
          }}
        >
          <Heart size={18} className="fill-white" />
        </Button>
      </div>
      
      <div className="p-4">
        <div 
          className="flex justify-between items-start mb-2 cursor-pointer"
          onClick={() => handleViewProduct(product)}
        >
          <div>
            <h3 className="font-medium line-clamp-1 group-hover:text-culture transition-colors">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.culture}</p>
          </div>
          <p className="font-semibold">${product.price.toFixed(2)}</p>
        </div>
        
        <p className={`text-xs ${
          typeof product.countInStock === 'undefined' || product.countInStock === null ? 
            'text-muted-foreground' : 
            product.countInStock > 10 ? 
              'text-green-600 dark:text-green-400' : 
              product.countInStock > 0 ? 
                'text-amber-600 dark:text-amber-400' : 
                'text-red-600 dark:text-red-400'
        }`}>
          {typeof product.countInStock === 'undefined' || product.countInStock === null ? 
            'Stock info unavailable' : 
            product.countInStock > 0 ? 
              `In stock: ${product.countInStock}` : 
              'Out of stock'}
        </p>
        
        <div className="mt-2 space-y-2" onClick={(e) => e.stopPropagation()}>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-between"
              >
                {selectedSize ? `Size: ${selectedSize}` : "Select Size"}
                <ChevronDown size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-2">
              <div className="grid grid-cols-4 gap-2">
                {sizes.map(size => (
                  <Button 
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSizeSelect(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            className="w-full flex items-center gap-2 transition-transform active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              if (!selectedSize) {
                toast.error("Please select a size first");
                return;
              }
              handleAddToCart(product, selectedSize);
            }}
            disabled={!selectedSize}
          >
            <ShoppingCart size={16} />
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const WishlistItemDraggable = ({ product, handleRemoveFromWishlist, handleAddToCart, handleViewProduct }) => {
  const dragControls = useDragControls();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  // Default sizes if the product doesn't specify any
  const sizes = product.sizes || ['S', 'M', 'L', 'XL'];
  
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setPopoverOpen(false); // Close the popover immediately after selection
  };
  
  return (
    <Reorder.Item
      value={product}
      dragControls={dragControls}
      className="relative bg-card rounded-lg overflow-hidden shadow-sm border cursor-grab active:cursor-grabbing mb-4"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
        <div className="md:flex-shrink-0 flex items-center gap-3">
          <div 
            className="touch-none"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <GripVertical className="h-6 w-6 text-muted-foreground" />
          </div>
          
          <div className="h-16 w-16 rounded-md overflow-hidden bg-secondary">
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 
            className="font-medium hover:text-culture transition-colors cursor-pointer"
            onClick={() => handleViewProduct(product)}
          >
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground">{product.culture}</p>
          <p className="text-sm font-semibold mt-1">${product.price.toFixed(2)}</p>
          <p className={`text-xs ${
            typeof product.countInStock === 'undefined' || product.countInStock === null ? 
              'text-muted-foreground' : 
              product.countInStock > 10 ? 
                'text-green-600 dark:text-green-400' : 
                product.countInStock > 0 ? 
                  'text-amber-600 dark:text-amber-400' : 
                  'text-red-600 dark:text-red-400'
          }`}>
            {typeof product.countInStock === 'undefined' || product.countInStock === null ? 
              'Stock info unavailable' : 
              product.countInStock > 0 ? 
                `In stock: ${product.countInStock}` : 
                'Out of stock'}
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-2 mt-2 md:mt-0 w-full md:w-auto md:min-w-[240px]">
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-between"
              >
                {selectedSize ? `Size: ${selectedSize}` : "Select Size"}
                <ChevronDown size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-2">
              <div className="grid grid-cols-4 gap-2">
                {sizes.map(size => (
                  <Button 
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSizeSelect(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => handleViewProduct(product)}
            >
              <Eye size={16} />
            </Button>
            <Button 
              size="sm" 
              variant="default"
              onClick={() => {
                if (!selectedSize) {
                  toast.error("Please select a size first");
                  return;
                }
                handleAddToCart(product, selectedSize);
              }}
              disabled={!selectedSize}
            >
              <ShoppingCart size={16} />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-destructive hover:text-destructive"
              onClick={() => handleRemoveFromWishlist(product)}
            >
              <Heart size={16} className="fill-current" />
            </Button>
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
};

export default Wishlist; 