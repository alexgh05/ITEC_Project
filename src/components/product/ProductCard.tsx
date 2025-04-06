import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NotifyMeButton from './NotifyMeButton';

export interface Product {
  id: string;
  _id?: string;
  name: string;
  price: number;
  category: string;
  culture: string;
  images: string[];
  description: string;
  isFeatured?: boolean;
  sizes?: string[];
  selectedSize?: string;
  countInStock?: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { isAuthenticated, token } = useAuthStore();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const isFavorite = isInWishlist(product.id);
  
  // Default sizes if the product doesn't specify any
  const sizes = product.sizes || ['S', 'M', 'L', 'XL'];

  // Ensure we have at least two images (front and back view)
  const frontImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/placeholder-product.jpg';
    
  const backImage = product.images && product.images.length > 1 
    ? product.images[1] 
    : '/placeholder-product-back.jpg'; // Use dedicated back placeholder

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setPopoverOpen(false); // Close the popover immediately after selection
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedSize) {
      toast.error("Please select a size first");
      return;
    }
    
    addItem({
      ...product,
      selectedSize,
    });
    toast.success(`${product.name} (${selectedSize}) added to cart!`);
    setSelectedSize(null); // Reset the size after adding to cart
    setPopoverOpen(false); // Close popover after adding to cart
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if product has a valid ID before proceeding
    if (!product.id) {
      console.error('Cannot add product to wishlist: Missing product ID', product);
      toast.error('Cannot add to wishlist: Invalid product');
      return;
    }
    
    try {
      await toggleItem(product, isAuthenticated ? token : undefined);
      toast.success(isFavorite 
        ? `${product.name} removed from wishlist!` 
        : `${product.name} added to wishlist!`
      );
    } catch (error) {
      toast.error(`Failed to ${isFavorite ? 'remove from' : 'add to'} wishlist`);
    }
  };

  // Check if product is out of stock
  const isOutOfStock = product.countInStock <= 0;

  return (
    <motion.div
      className="product-card group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Flip Card Container */}
      <div className="flip-card h-[300px] rounded-t-lg overflow-hidden">
        <div className="flip-card-inner">
          {/* Front Side */}
          <div className="flip-card-front">
            <Link to={`/product/${product.id}`} className="block w-full h-full">
              <img 
                src={frontImage} 
                alt={`${product.name} - Front view`} 
                className="w-full h-full object-cover object-center"
              />
              
              {product.isFeatured && (
                <div className="absolute top-2 left-2 bg-culture text-culture-foreground text-xs font-medium py-1 px-2 rounded">
                  Featured
                </div>
              )}
            </Link>
          </div>
          
          {/* Back Side */}
          <div className="flip-card-back">
            <Link to={`/product/${product.id}`} className="block w-full h-full">
              <img 
                src={backImage} 
                alt={`${product.name} - Back view`} 
                className="w-full h-full object-cover object-center"
              />
              
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-1 font-medium">
                Back View
              </div>
            </Link>
          </div>
        </div>
        
        {/* Wishlist button (outside the flip card inner to always be accessible) */}
        <Button 
          size="icon" 
          variant="ghost" 
          className="absolute top-2 right-2 bg-background/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={handleToggleWishlist}
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            size={18} 
            className={isFavorite ? "fill-red-500 text-red-500" : ""}
          />
        </Button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium line-clamp-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.culture}</p>
          </div>
          <p className="font-semibold">${product.price.toFixed(2)}</p>
        </div>

        <div className="mt-1">
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

        <div className="mt-4 space-y-2">
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-between"
                disabled={isOutOfStock}
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
          
          {isOutOfStock ? (
            <NotifyMeButton 
              productId={product._id || product.id} 
              productName={product.name}
              className="w-full"
            />
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full bg-secondary hover:bg-secondary/80 flex items-center justify-center gap-2"
              onClick={handleAddToCart}
              disabled={!selectedSize}
            >
              <ShoppingCart size={16} />
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
