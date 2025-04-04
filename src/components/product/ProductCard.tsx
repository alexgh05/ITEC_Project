import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  culture: string;
  images: string[];
  description: string;
  isFeatured?: boolean;
  sizes?: string[];
  selectedSize?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const isFavorite = isInWishlist(product.id);
  
  // Default sizes if the product doesn't specify any
  const sizes = product.sizes || ['S', 'M', 'L', 'XL'];

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

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem(product);
    toast.success(isFavorite 
      ? `${product.name} removed from wishlist!` 
      : `${product.name} added to wishlist!`
    );
  };

  return (
    <motion.div
      className="product-card hover-scale group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="product-image-container">
        <Link to={`/shop/product/${product.id}`}>
          <motion.img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700"
            animate={{ scale: isHovered && product.images.length > 1 ? 1.05 : 1 }}
          />
          
          {product.images.length > 1 && (
            <motion.img
              src={product.images[1]}
              alt={`${product.name} alternate view`}
              className="absolute inset-0 w-full h-full object-cover object-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </Link>

        <Button 
          size="icon" 
          variant="ghost" 
          className="absolute top-2 right-2 bg-background/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleToggleWishlist}
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            size={18} 
            className={isFavorite ? "fill-red-500 text-red-500" : ""}
          />
        </Button>

        {product.isFeatured && (
          <div className="absolute top-2 left-2 bg-culture text-culture-foreground text-xs font-medium py-1 px-2 rounded">
            Featured
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium line-clamp-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.culture}</p>
          </div>
          <p className="font-semibold">${product.price.toFixed(2)}</p>
        </div>

        <div className="mt-4 space-y-2">
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
            variant="outline" 
            size="sm" 
            className="w-full bg-secondary hover:bg-secondary/80 flex items-center justify-center gap-2"
            onClick={handleAddToCart}
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

export default ProductCard;
