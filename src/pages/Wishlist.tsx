import { useEffect } from 'react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Wishlist = () => {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    // Set page title
    document.title = "Wishlist | CultureDrop";
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleAddToCart = (product: any) => {
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleRemoveFromWishlist = (product: any) => {
    removeItem(product.id);
    toast.success(`${product.name} removed from wishlist!`);
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
            <h1 className="text-4xl font-bold">Wishlist</h1>
          </div>
          <p className="text-muted-foreground">Your saved items for future purchase</p>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="container mx-auto">
          {items.length === 0 ? (
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
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">
                  {items.length} {items.length === 1 ? 'Item' : 'Items'}
                </h2>
                <Button variant="outline" onClick={clearWishlist}>
                  Clear Wishlist
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map(product => (
                  <motion.div
                    key={product.id}
                    className="relative bg-card rounded-lg overflow-hidden shadow-sm border"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative aspect-square bg-secondary">
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover object-center"
                      />
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveFromWishlist(product)}
                      >
                        <Heart size={18} className="fill-white" />
                      </Button>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium line-clamp-1">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.culture}</p>
                        </div>
                        <p className="font-semibold">${product.price.toFixed(2)}</p>
                      </div>
                      
                      <Button 
                        className="w-full mt-2 flex items-center gap-2"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Wishlist; 