import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useCartStore } from '@/store/useCartStore';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { fetchProducts } from '@/lib/api';
import { useThemeStore, CultureTheme } from '@/store/useThemeStore';

// OutfitResult type definition
interface OutfitResult {
  name: string;
  description: string;
  colorPalette: string[];
  dominantColor: string;
  musicGenre: string;
  city: string;
  emotionalState: string;
  imageUrl: string;
  outfitElements?: {
    hat: string;
    tShirt: string;
    pants: string;
    accessory: string;
  };
  musicRecommendation?: string;
}

interface OutfitCardProps {
  outfit: OutfitResult;
}

// Product interface - making it compatible with the app's ProductCard Product type
interface Product {
  id: string;
  _id?: string;
  name: string;
  price: number;
  stock?: number;
  image?: string;
  category: string;
  culture?: string;
  images?: string[];
  description?: string;
  selectedSize?: string;
  countInStock?: number;
}

// ProductItem component
interface ProductItemProps {
  product: Product;
  originalName: string;
  isMusic?: boolean;
  compact?: boolean;
  onAddToCart: (product: Product) => void;
}

const ProductItem = ({ product, originalName, isMusic = false, compact = false, onAddToCart }: ProductItemProps) => {
  if (!product) return null;
  const { darkMode } = useThemeStore();
  
  return (
    <div className={`relative border rounded-md overflow-hidden product-card ${compact ? 'h-auto' : 'h-auto'} ${darkMode ? 'bg-black/40 border-culture/20' : 'bg-white/95 border-gray-200'}`}>
      <div className={`flex ${compact ? 'flex-col' : 'flex-col'}`}>
        <div className={`${compact ? 'w-full aspect-square' : 'w-full aspect-square'} bg-muted premium-image`}>
          <img 
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className={`${compact ? 'p-3' : 'p-3'} flex flex-col justify-between`}>
          <div>
            <h3 className={`${compact ? 'text-sm' : 'text-base'} font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {product.name}
            </h3>
            <p className={`text-culture ${compact ? 'text-xs' : 'text-sm'} font-semibold`}>
              ${product.price.toFixed(2)}
            </p>
          </div>
          
          {/* Always show Add to Cart button */}
          <div className="mt-2 space-y-2">
            <p className="text-xs">
              {product.stock > 10 ? 
                <span className="text-green-600">In Stock</span> : 
                product.stock > 0 ? 
                  <span className="text-amber-600">Low Stock: {product.stock}</span> : 
                  <span className="text-red-600">Out of Stock</span>
              }
            </p>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full h-8 bg-culture/10 hover:bg-culture/20 text-culture"
              disabled={product.stock <= 0}
              onClick={() => onAddToCart(product)}
              data-product-id={product.id}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
      
      {isMusic && (
        <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18V6L21 3V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="6" cy="18" r="3" stroke="white" strokeWidth="2"/>
            <circle cx="18" cy="15" r="3" stroke="white" strokeWidth="2"/>
          </svg>
        </div>
      )}
    </div>
  );
};

export const OutfitCard = ({ outfit }: OutfitCardProps) => {
  const [showImage, setShowImage] = useState(false);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);
  
  // Use the global cart store
  const { addItem, items, getTotalItems } = useCartStore();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  // Add theme store access for dark mode
  const { darkMode, cultureInfo } = useThemeStore();
  
  // Fetch real products from the store
  useEffect(() => {
    const getStoreProducts = async () => {
      try {
        setLoading(true);
        // Fetch products with the same culture as the outfit if possible
        const products = await fetchProducts(undefined, outfit.city);
        
        // If no products match the exact culture, fetch all products
        if (products.length === 0) {
          const allProducts = await fetchProducts();
          setStoreProducts(allProducts.map(product => ({
            ...product,
            id: product._id || product.id, // Ensure id is set for consistency
            image: product.images && product.images.length > 0 ? product.images[0] : '',
            stock: product.countInStock
          })));
        } else {
          setStoreProducts(products.map(product => ({
            ...product,
            id: product._id || product.id, // Ensure id is set for consistency
            image: product.images && product.images.length > 0 ? product.images[0] : '',
            stock: product.countInStock
          })));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error fetching products",
          description: "Could not load store products. Using limited selection.",
          duration: 3000,
        });
        setLoading(false);
      }
    };
    
    getStoreProducts();
  }, [outfit.city]);
  
  // Add to cart function
  const addToCart = (product: Product) => {
    // Add mock images array since the cart expects it
    const cartProduct = {
      ...product,
      images: product.images || [product.image || ''],
      culture: product.culture || outfit.city,
      description: product.description || `From the ${outfit.name} collection.`,
      countInStock: product.countInStock || product.stock || 0,
      selectedSize: 'M' // Default size
    };
    
    // Add to global cart
    addItem(cartProduct);
    
    // Add visual feedback
    const button = document.querySelector(`[data-product-id="${product.id}"]`) as HTMLElement;
    if (button) {
      button.classList.add('button-clicked');
      setTimeout(() => {
        button.classList.remove('button-clicked');
      }, 200);
    }
  };
  
  // Buy complete look function
  const buyCompleteLook = () => {
    // Check if user is logged in
    if (!isAuthenticated) {
      console.log('User is not authenticated, redirecting to login page');
      toast({
        title: "Authentication Required",
        description: "Please login to continue with this purchase",
        duration: 3000,
      });
      
      // Force redirect to login page with a slight delay to ensure the toast is displayed
      setTimeout(() => {
        window.location.href = '/login';
      }, 300);
      return;
    }
    
    // Get only visible products that are currently displayed
    const visibleProducts = Object.entries(products)
      .filter(([_, product]) => product !== undefined)
      .map(([_, product]) => product);
    
    if (visibleProducts.length === 0) {
      toast({
        title: "No products available",
        description: "There are no products to add to cart",
        duration: 2000,
      });
      return;
    }
    
    // Add only the visible products with 15% discount
    visibleProducts.forEach(product => {
      // Create a cart product with 15% discount
      const cartProduct = {
        ...product,
        images: product.images || [product.image || ''],
        culture: product.culture || outfit.city,
        description: product.description || `From the ${outfit.name} collection. SAVE 15% with Complete Look!`,
        countInStock: product.countInStock || product.stock || 0,
        selectedSize: 'M' // Default size
      };
      
      // Add to global cart with 15% discount
      addItem(cartProduct, 15);
    });
    
    // Show toast message for complete look
    toast({
      title: "Complete look added!",
      description: `${visibleProducts.length} items added to cart with 15% discount`,
      duration: 3000,
    });
    
    // Navigate to cart page
    navigate('/cart');
  };
  
  // Generate product recommendations based on the outfit
  useEffect(() => {
    if (storeProducts.length === 0 && !loading) return;
    
    // Match products to the outfit
    const matchProducts = () => {
      // Group products by category
      const productsByCategory = storeProducts.reduce((acc, product) => {
        // Normalize category
        const category = product.category.toLowerCase();
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(product);
        return acc;
      }, { tops: [], bottoms: [], accessories: [], footwear: [], headwear: [], outerwear: [], music: [] });
      
      // Helper to get products that match the city
      const getProductsByCity = (products: Product[], cityName: string) => {
        const cityCulture = cityName.toLowerCase();
        
        // Try to match by exact culture first
        const cultureMatch = products.filter(
          p => p.culture && p.culture.toLowerCase() === cityCulture
        );
        
        return cultureMatch.length > 0 
          ? cultureMatch 
          : products; // If no match, return all products in that category
      };
      
      // Select one product from each relevant category
      // First try to match products by city, then fall back to any product in the category
      const categoryProducts: Record<string, Product | undefined> = {};
      
      // Get products matching the outfit's city for each category
      const cityTops = getProductsByCity(productsByCategory.tops || [], outfit.city);
      const cityAccessories = getProductsByCity(productsByCategory.accessories || [], outfit.city);
      const cityMusic = getProductsByCity(productsByCategory.music || [], outfit.city);
      const cityHeadwear = getProductsByCity(productsByCategory.headwear || [], outfit.city);
      const cityFootwear = getProductsByCity(productsByCategory.footwear || [], outfit.city);
      const cityOuterwear = getProductsByCity(productsByCategory.outerwear || [], outfit.city);
      const cityBottoms = getProductsByCity(productsByCategory.bottoms || [], outfit.city);
      
      // Function to get a random item from an array
      const getRandomItem = (items: any[]) => items[Math.floor(Math.random() * items.length)];
      
      // Select one product from each category if available
      if (cityTops.length > 0) categoryProducts.top = getRandomItem(cityTops);
      if (cityAccessories.length > 0) categoryProducts.accessory = getRandomItem(cityAccessories);
      if (cityMusic.length > 0) categoryProducts.music = getRandomItem(cityMusic);
      if (cityHeadwear.length > 0) categoryProducts.headwear = getRandomItem(cityHeadwear);
      if (cityFootwear.length > 0) categoryProducts.footwear = getRandomItem(cityFootwear);
      if (cityOuterwear.length > 0) categoryProducts.outerwear = getRandomItem(cityOuterwear);
      if (cityBottoms.length > 0) categoryProducts.bottom = getRandomItem(cityBottoms);
      
      // Update state with selected products
      setProducts(categoryProducts);
    };
    
    // Call matchProducts when storeProducts is loaded
    if (!loading && storeProducts.length > 0) {
      matchProducts();
    }
  }, [storeProducts, outfit, loading]);
  
  // Utility function to convert hex color to RGB values
  const getRGBFromHex = (hex: string): string => {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Return as comma-separated string for use in rgba()
    return `${r}, ${g}, ${b}`;
  };
  
  // Check for necessary outfit data
  if (!outfit || !outfit.colorPalette || !outfit.name) {
    return (
      <div className={`${darkMode ? 'bg-black/60' : 'bg-white/95'} p-8 rounded-lg text-center shadow-md`}>
        <div className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>Error: Incomplete outfit data</div>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-6xl mx-auto">
      {loading ? (
        <Card className="w-full p-6 animate-pulse">
          <div className="h-8 w-3/4 bg-muted mb-4 rounded"></div>
          <div className="h-4 w-full bg-muted mb-2 rounded"></div>
          <div className="h-4 w-5/6 bg-muted mb-2 rounded"></div>
          <div className="h-4 w-4/6 bg-muted mb-8 rounded"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-40 bg-muted rounded"></div>
                <div className="h-4 w-3/4 bg-muted rounded"></div>
                <div className="h-4 w-1/2 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card 
          className={`overflow-hidden ${
            darkMode ? 'bg-black/40 border-culture/20' : 'bg-white/95 border-gray-200'
          } backdrop-blur-md shadow-lg`}
          style={{
            boxShadow: darkMode 
              ? `0 0 40px rgba(${getRGBFromHex(outfit.dominantColor)}, 0.2)`
              : `0 8px 30px rgba(0, 0, 0, 0.1)`,
            background: darkMode 
              ? `rgba(0, 0, 0, 0.4)`
              : outfit.city && cultureInfo && cultureInfo[outfit.city as CultureTheme]
                ? `rgba(255, 255, 255, 0.95)`
                : `rgba(255, 255, 255, 0.95)`
          }}
        >
          <div className="p-6 space-y-6">
            <div className="space-y-1">
              <h3 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {outfit.name}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                {outfit.city} • {outfit.musicGenre} • {outfit.emotionalState}
              </p>
            </div>
            
            <p className={`text-sm/relaxed ${darkMode ? 'text-white/80' : 'text-gray-700'} whitespace-pre-line`}>
              {outfit.description}
            </p>
            
            {/* Color palette display */}
            <div className="flex space-x-2">
              {outfit.colorPalette.map((color, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded-full ${darkMode ? 'border border-white/20' : 'border border-gray-200'}`}
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
      
      {/* Product listings */}
      {!loading && (
        <div className="space-y-6">
          <h4 className={`text-lg font-medium ${darkMode ? 'text-white/90' : 'text-gray-800'}`}>
            Recommended Products:
          </h4>
          
          {/* Product grid - now 3 columns for better layout with full cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
            {/* Now we show any available products */}
            {Object.entries(products).map(([key, product]) => (
              product && (
                <ProductItem 
                  key={product.id}
                  product={product}
                  originalName={key}
                  isMusic={key === 'music'}
                  compact={false}
                  onAddToCart={addToCart}
                />
              )
            ))}
          </div>
          
          {/* No products message */}
          {Object.keys(products).length === 0 && (
            <div className={`text-center p-4 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'} rounded-md`}>
              <p className={`${darkMode ? 'text-white/70' : 'text-gray-700'}`}>No products found for this outfit.</p>
              <p className={`${darkMode ? 'text-white/50' : 'text-gray-500'} text-sm mt-1`}>Try generating a new outfit.</p>
            </div>
          )}
        </div>
      )}
      
      {/* Buy complete look button */}
      {!loading && Object.keys(products).length > 0 && (
        <div className="mt-8 border-t border-culture/20 pt-6 flex justify-center">
          <Button 
            className="w-full max-w-lg mx-auto bg-gradient-to-r from-culture/90 to-culture text-white cursor-pointer flex items-center justify-center shadow-lg shadow-culture/20 py-6 hover:shadow-xl hover:shadow-culture/30 transition-all font-medium text-base group"
            size="default"
            onClick={() => {
              buyCompleteLook();
            }}
            data-testid="buy-complete-look"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 group-hover:animate-bounce">
              <circle cx="8" cy="21" r="1"/>
              <circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            Buy All {Object.keys(products).length} Items - Save 15%
          </Button>
        </div>
      )}
      
      {/* Cart indicator - Always visible and animated */}
      <div 
        className="fixed bottom-6 right-6 bg-culture text-white p-3 rounded-full shadow-lg z-50 cursor-pointer animate-bounce hover:bg-culture-foreground transition-colors"
        onClick={() => navigate('/cart')}
      >
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="21" r="1"/>
            <circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
            <span className="text-culture text-xs font-bold">{getTotalItems() || 0}</span>
          </div>
        </div>
      </div>
          </div>
        </Card>
      )}
    </div>
  );
}; 