import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowLeft, ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/store/useThemeStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { toast } from 'sonner';

// Mock product data - would come from an API in a real app
const products = [
  {
    id: 'p1',
    name: 'Tokyo Neon Hoodie',
    price: 89.99,
    category: 'fashion',
    culture: 'tokyo',
    images: ['/product-1a.jpg', '/product-1b.jpg', '/product-1c.jpg'],
    description: 'Inspired by the neon-lit streets of Shibuya, this hoodie features a unique blend of contemporary Japanese street fashion with cyberpunk aesthetics. The glow-in-the-dark print captures the essence of Tokyo\'s vibrant nightlife.',
    sizes: ['S', 'M', 'L', 'XL'],
    relatedProductIds: ['p5', 'p3', 'p7']
  },
  // Other products would be defined here
];

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { setCulture } = useThemeStore();
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();

  useEffect(() => {
    // In a real app, this would fetch from an API
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const foundProduct = products.find(p => p.id === id);
      setProduct(foundProduct || null);
      setLoading(false);
      
      if (foundProduct) {
        document.title = `${foundProduct.name} | CultureDrop`;
        // Set the culture theme to match the product
        setCulture(foundProduct.culture as any);
      }
    }, 500);
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id, setCulture]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      toast.error("Please select a size first");
      return;
    }
    
    addItem({
      ...product,
      selectedSize,
    });
    toast.success(`${product.name} (${selectedSize}) added to cart!`);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleItem(product);
    toast.success(isInWishlist(product.id)
      ? `${product.name} removed from wishlist!` 
      : `${product.name} added to wishlist!`
    );
  };

  const handleNextImage = () => {
    if (product) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const handlePrevImage = () => {
    if (product) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-pulse text-xl">Loading product...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild variant="outline">
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Check if the product is in the wishlist
  const isFavorite = product ? isInWishlist(product.id) : false;

  return (
    <div className="container mx-auto py-8 px-4">
      <Link to="/shop" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] bg-muted rounded-lg overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                {/* This would be a real image in a production app */}
                <div className={`w-full h-full bg-gradient-to-br from-culture to-culture-accent/50 culture-${product.culture}`} />
              </motion.div>
            </AnimatePresence>
            
            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-2"
              onClick={handlePrevImage}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-2"
              onClick={handleNextImage}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex space-x-4">
            {product.images.map((_, i) => (
              <button
                key={i}
                className={`w-20 h-20 rounded-md bg-muted overflow-hidden border-2 ${
                  i === selectedImage ? 'border-culture' : 'border-transparent'
                }`}
                onClick={() => setSelectedImage(i)}
                aria-label={`View image ${i + 1}`}
              >
                {/* This would be a real thumbnail in a production app */}
                <div className={`w-full h-full bg-gradient-to-br from-culture to-culture-accent/50 culture-${product.culture}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-2xl font-semibold">${product.price.toFixed(2)}</span>
            <span className="text-sm py-1 px-2 bg-secondary rounded-md">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </span>
          </div>

          <p className="text-muted-foreground mb-6">
            {product.description}
          </p>

          <div className="mb-6">
            <h3 className="font-medium mb-3">Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size: string) => (
                <button
                  key={size}
                  className={`w-12 h-12 rounded-md border flex items-center justify-center ${
                    selectedSize === size 
                      ? 'bg-culture text-culture-foreground' 
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            {!selectedSize && (
              <p className="text-sm text-muted-foreground mt-2">Please select a size</p>
            )}
          </div>

          <div className="flex space-x-4 mb-8">
            <Button 
              className="flex-1 bg-culture text-culture-foreground hover:bg-culture/90"
              disabled={!selectedSize}
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleToggleWishlist}
              aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart 
                className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
              />
            </Button>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-medium mb-2">Product details</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Premium quality materials</li>
              <li>Inspired by {product.culture} culture</li>
              <li>Machine washable</li>
              <li>Exclusive CultureDrop design</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
