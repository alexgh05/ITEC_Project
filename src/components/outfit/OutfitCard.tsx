import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useCartStore } from '@/store/useCartStore';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

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
  name: string;
  price: number;
  stock: number;
  image: string;
  category: string;
  culture?: string;
  images?: string[];
  description?: string;
  selectedSize?: string;
  // Add compatibility with cart store
  countInStock?: number;
}

// Local product database - using the actual product images from public/products
const localProducts: Product[] = [
  {
    id: 'tokyo-hoodie-1',
    name: 'Tokyo Neon Hoodie',
    price: 89.99,
    stock: 14,
    image: '/products/tokyo-neon-hoodie-1.svg',
    category: 'tops'
  },
  {
    id: 'tokyo-hoodie-2',
    name: 'Tokyo Streetwear Hoodie',
    price: 94.99,
    stock: 8,
    image: '/products/tokyo-neon-hoodie-2.svg',
    category: 'tops'
  },
  {
    id: 'rio-tshirt-1',
    name: 'Rio Festival T-Shirt',
    price: 39.99,
    stock: 23,
    image: '/products/rio-festival-tshirt-1.svg',
    category: 'tops'
  },
  {
    id: 'rio-tshirt-2',
    name: 'Rio Vibrant Graphic Tee',
    price: 42.99,
    stock: 17,
    image: '/products/rio-festival-tshirt-2.svg',
    category: 'tops'
  },
  {
    id: 'seoul-jacket-1',
    name: 'Seoul Streetwear Jacket',
    price: 129.99,
    stock: 6,
    image: '/products/seoul-streetwear-jacket-1.svg',
    category: 'tops'
  },
  {
    id: 'seoul-jacket-2',
    name: 'Seoul Urban Jacket',
    price: 135.99,
    stock: 5,
    image: '/products/seoul-streetwear-jacket-2.svg',
    category: 'tops'
  },
  {
    id: 'nyc-cap-1',
    name: 'NYC Graffiti Cap',
    price: 34.99,
    stock: 19,
    image: '/products/nyc-graffiti-cap-1.svg',
    category: 'accessories'
  },
  {
    id: 'nyc-cap-2',
    name: 'NYC Urban Snapback',
    price: 39.99,
    stock: 12,
    image: '/products/nyc-graffiti-cap-2.svg',
    category: 'accessories'
  },
  {
    id: 'london-umbrella-1',
    name: 'London Fog Umbrella',
    price: 49.99,
    stock: 9,
    image: '/products/london-fog-umbrella-1.svg',
    category: 'accessories'
  },
  {
    id: 'london-umbrella-2',
    name: 'London Rainy Day Umbrella',
    price: 54.99,
    stock: 7,
    image: '/products/london-fog-umbrella-2.svg',
    category: 'accessories'
  },
  {
    id: 'nyc-vinyl-1',
    name: 'NYC Underground Vinyl',
    price: 29.99,
    stock: 15,
    image: '/products/nyc-underground-vinyl-1.svg',
    category: 'music'
  },
  {
    id: 'nyc-vinyl-2',
    name: 'NYC Hip-Hop Classics Vinyl',
    price: 34.99,
    stock: 8,
    image: '/products/nyc-underground-vinyl-2.svg',
    category: 'music'
  },
  {
    id: 'lagos-headphones-1',
    name: 'Lagos Beats Headphones',
    price: 149.99,
    stock: 11,
    image: '/products/lagos-beats-headphones-1.svg',
    category: 'accessories'
  },
  {
    id: 'lagos-headphones-2',
    name: 'Lagos Premium Headphones',
    price: 179.99,
    stock: 6,
    image: '/products/lagos-beats-headphones-2.svg',
    category: 'accessories'
  }
];

export const OutfitCard = ({ outfit }: OutfitCardProps) => {
  const [showImage, setShowImage] = useState(false);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  
  // Use the global cart store
  const { addItem, items, getTotalItems } = useCartStore();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  // Add to cart function
  const addToCart = (product: Product) => {
    // Add mock images array since the cart expects it
    const cartProduct = {
      ...product,
      images: [product.image],
      culture: outfit.city,
      description: `From the ${outfit.name} collection.`,
      countInStock: product.stock,
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
        images: [product.image],
        culture: outfit.city,
        description: `From the ${outfit.name} collection. SAVE 15% with Complete Look!`,
        countInStock: product.stock,
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
    
    // Add visual feedback
    const buyButton = document.querySelector('[data-testid="buy-complete-look"]') as HTMLElement;
    if (buyButton) {
      buyButton.classList.add('button-flash');
      setTimeout(() => {
        buyButton.classList.remove('button-flash');
      }, 200);
    }
    
    // Navigate to cart after delay
    setTimeout(() => navigate('/cart'), 1000);
  };
  
  // Match outfit elements to products in our local database
  useEffect(() => {
    const matchProducts = () => {
      try {
        setLoading(true);
        
        // Categorize our products by type for easier selection
        const productsByCategory = {
          tops: localProducts.filter(p => p.category === 'tops'),
          accessories: localProducts.filter(p => p.category === 'accessories'),
          music: localProducts.filter(p => p.category === 'music')
        };
        
        // Initialize product data object
        const productData: Record<string, Product> = {};
        
        // Helper function to get products that match the city
        const getProductsByCity = (products: Product[], cityName: string) => {
          // First attempt exact match by city name in product name
          const exactMatches = products.filter(p => 
            p.name.toLowerCase().includes(cityName.toLowerCase())
          );
          
          if (exactMatches.length > 0) {
            return exactMatches;
          }
          
          // For some cities, use alternative keywords that represent the city style
          const cityKeywords: Record<string, string[]> = {
            'london': ['london', 'fog', 'british', 'uk'],
            'tokyo': ['tokyo', 'japan', 'neon'],
            'newyork': ['nyc', 'new york', 'yankees', 'urban'],
            'paris': ['paris', 'french'],
            'seoul': ['seoul', 'korean'],
            'rio': ['rio', 'brazil', 'festival'],
            'lagos': ['lagos', 'africa', 'beats'],
            'mumbai': ['mumbai', 'indian']
          };
          
          const keywords = cityKeywords[cityName.toLowerCase()] || [cityName.toLowerCase()];
          
          // Search for products that match any of the city keywords
          const keywordMatches = products.filter(p => 
            keywords.some(keyword => p.name.toLowerCase().includes(keyword))
          );
          
          return keywordMatches.length > 0 ? keywordMatches : products;
        };
        
        if (outfit.outfitElements) {
          // We always want exactly 4 products total
          
          // Filter products by city first
          const cityTops = getProductsByCity(productsByCategory.tops, outfit.city);
          const cityAccessories = getProductsByCity(productsByCategory.accessories, outfit.city);
          const cityMusic = getProductsByCity(productsByCategory.music, outfit.city);
          
          // 1. Add top item (always included)
          if (cityTops.length > 0) {
            const randomTop = cityTops[Math.floor(Math.random() * cityTops.length)];
            productData.tShirt = randomTop;
          } else if (productsByCategory.tops.length > 0) {
            // Fallback to any top if no city-specific ones are found
            productData.tShirt = productsByCategory.tops[Math.floor(Math.random() * productsByCategory.tops.length)];
          }
          
          // 2. Add hat (always included)
          // Try to find a hat specific to the city
          const hats = cityAccessories.filter(p => 
            p.name.toLowerCase().includes('cap') || 
            p.name.toLowerCase().includes('hat')
          );
          
          if (hats.length > 0) {
            productData.hat = hats[Math.floor(Math.random() * hats.length)];
          } else {
            // No city-specific hat found, try any hat
            const anyHats = productsByCategory.accessories.filter(p => 
              p.name.toLowerCase().includes('cap') || 
              p.name.toLowerCase().includes('hat')
            );
            
            if (anyHats.length > 0) {
              productData.hat = anyHats[Math.floor(Math.random() * anyHats.length)];
            } else {
              // No hat found at all, use any city-specific accessory
              if (cityAccessories.length > 0) {
                productData.hat = cityAccessories[Math.floor(Math.random() * cityAccessories.length)];
              }
            }
          }
          
          // 3. Add pants (always included)
          // For pants, create a custom product using an existing image but with city-specific name
          const pantsTemplate = cityTops.length > 0 
            ? cityTops[Math.floor(Math.random() * cityTops.length)]
            : productsByCategory.tops[Math.floor(Math.random() * productsByCategory.tops.length)];
            
          productData.pants = {
            ...pantsTemplate,
            id: 'custom-pants-' + Math.floor(Math.random() * 1000),
            name: getCityPrefix(outfit.city) + ' ' + outfit.outfitElements.pants,
            price: 79.99 + (Math.random() * 60),
            stock: 5 + Math.floor(Math.random() * 15)
          };
          
          // 4. Add accessory or music (prioritize accessory over music)
          // Find a non-hat accessory specific to the city
          const usedHatId = productData.hat?.id;
          
          const nonHatAccessories = cityAccessories.filter(p => 
            p.id !== usedHatId && 
            !(p.name.toLowerCase().includes('cap') || p.name.toLowerCase().includes('hat'))
          );
          
          if (nonHatAccessories.length > 0) {
            // Add a non-hat accessory as the 4th item
            productData.accessory = nonHatAccessories[Math.floor(Math.random() * nonHatAccessories.length)];
          } else if (cityMusic.length > 0) {
            // If no suitable accessory, add city-specific music
            productData.music = cityMusic[Math.floor(Math.random() * cityMusic.length)];
          } else if (outfit.musicRecommendation && productsByCategory.music.length > 0) {
            // Or any music if available
            const randomMusicProduct = productsByCategory.music[
              Math.floor(Math.random() * productsByCategory.music.length)
            ];
            
            productData.music = {
              ...randomMusicProduct,
              name: outfit.musicRecommendation,
              price: 24.99 + (Math.random() * 15),
              stock: 3 + Math.floor(Math.random() * 8)
            };
          } else {
            // Last resort - create a city-themed accessory
            productData.accessory = {
              ...(cityAccessories[0] || productsByCategory.accessories[0] || localProducts[0]),
              id: 'custom-accessory-' + Math.floor(Math.random() * 1000),
              name: getCityPrefix(outfit.city) + ' Fashion Accessory',
              price: 49.99 + (Math.random() * 30),
              stock: 4 + Math.floor(Math.random() * 6)
            };
          }
        }
        
        setProducts(productData);
      } catch (error) {
        console.error('Error matching products:', error);
      } finally {
        setLoading(false);
        setShowImage(true);
      }
    };
    
    // Helper function to get a stylistic prefix for a city
    const getCityPrefix = (city: string): string => {
      const cityPrefixes: Record<string, string> = {
        'tokyo': 'Tokyo Neon',
        'paris': 'Paris Chic',
        'newyork': 'NYC Urban',
        'london': 'London Fog',
        'seoul': 'Seoul K-Style',
        'lagos': 'Lagos Premium',
        'mumbai': 'Mumbai Vibrant',
        'rio': 'Rio Festival'
      };
      
      return cityPrefixes[city.toLowerCase()] || city;
    };
    
    matchProducts();
  }, [outfit]);
  
  return (
    <Card className="overflow-hidden bg-black/40 backdrop-blur-xl border-culture/20 p-6 premium-shadow">
      {/* Header with outfit name */}
      <div className="mb-6 border-b border-culture/20 pb-4">
        <h3 className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
          {outfit.name}
        </h3>
        <p className="text-white/70 mt-2">
          {outfit.description}
        </p>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="py-8 flex flex-col items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-2 border-culture flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-culture/20 animate-ping"></div>
            </div>
            <div className="mt-4 text-culture/80 text-sm">Finding products from our collection...</div>
          </div>
        </div>
      )}
      
      {/* Product listings */}
      {!loading && outfit.outfitElements && (
        <div className="space-y-6">
          {/* Product grid - 2x2 layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center justify-items-center w-full">
            {/* Hat */}
            {products.hat && (
              <ProductItem 
                product={products.hat}
                originalName={outfit.outfitElements.hat}
                compact={true}
                onAddToCart={addToCart}
              />
            )}
            
            {/* T-Shirt */}
            {products.tShirt && (
              <ProductItem 
                product={products.tShirt}
                originalName={outfit.outfitElements.tShirt}
                compact={true}
                onAddToCart={addToCart}
              />
            )}
            
            {/* Pants */}
            {products.pants && (
              <ProductItem 
                product={products.pants}
                originalName={outfit.outfitElements.pants}
                compact={true}
                onAddToCart={addToCart}
              />
            )}
            
            {/* Accessory or Music item */}
            {products.accessory ? (
              <ProductItem 
                product={products.accessory}
                originalName={outfit.outfitElements.accessory}
                compact={true}
                onAddToCart={addToCart}
              />
            ) : products.music ? (
              <ProductItem 
                product={products.music}
                originalName={outfit.musicRecommendation || ""}
                isMusic={true}
                compact={true}
                onAddToCart={addToCart}
              />
            ) : null}
          </div>
        </div>
      )}
      
      {/* Buy complete look button */}
      {!loading && outfit.outfitElements && (
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
            Buy 4 {outfit.city.charAt(0).toUpperCase() + outfit.city.slice(1)} Items - Save 15%
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
    </Card>
  );
};

// Product item component
interface ProductItemProps {
  product: Product;
  originalName: string;
  isMusic?: boolean;
  compact?: boolean;
  onAddToCart: (product: Product) => void;
}

const ProductItem = ({ product, originalName, isMusic = false, compact = false, onAddToCart }: ProductItemProps) => {
  console.log('Rendering ProductItem:', { 
    product, 
    imagePath: product.image,
    exists: typeof product.image === 'string'
  });
  
  return (
    <div className="premium-card rounded-lg overflow-hidden w-full max-w-[280px]">
      {/* Product image */}
      <div className="premium-image w-full h-36">
        <img 
          src={product.image.startsWith('/') ? product.image : `/${product.image}`} 
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            console.error(`Failed to load image: ${product.image}`);
            const target = e.target as HTMLImageElement;
            target.src = '/fashion-placeholder.jpg';
          }}
        />
      </div>
      
      {/* Product details */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="text-white text-sm font-medium line-clamp-1 flex-1">
            {product.name}
            {product.name !== originalName && !product.name.includes(originalName) && isMusic && (
              <div className="text-culture/70 text-xs mt-0.5 line-clamp-1">
                Album: {originalName}
              </div>
            )}
          </div>
          <div className="ml-2 text-culture text-lg font-bold">${product.price.toFixed(2)}</div>
        </div>
        
        <div className="flex justify-between items-center mt-2 mb-3">
          <div className="text-white/60 text-xs">{product.stock} in stock</div>
          {product.stock < 10 && (
            <div className="text-culture/80 text-xs font-medium">Limited availability</div>
          )}
        </div>
        
        <button 
          className="w-full bg-culture hover:bg-culture/90 text-white text-xs py-2.5 px-3 rounded-md flex items-center justify-center shadow-md shadow-culture/10 hover:shadow-lg transition-all"
          onClick={() => onAddToCart(product)}
          data-product-id={product.id}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <circle cx="8" cy="21" r="1"/>
            <circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
          Add to Cart
        </button>
      </div>
    </div>
  );
}; 