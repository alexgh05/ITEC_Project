import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '@/components/product/ProductGrid';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/store/useThemeStore';

// Mock product data - would come from an API in a real app
const allProducts = [
  {
    id: 'p1',
    name: 'Tokyo Neon Hoodie',
    price: 89.99,
    category: 'fashion',
    culture: 'Tokyo',
    images: ['/product-1a.jpg', '/product-1b.jpg'],
    description: 'Inspired by the neon-lit streets of Shibuya',
    isFeatured: true
  },
  {
    id: 'p2',
    name: 'NYC Underground Vinyl',
    price: 29.99,
    category: 'music',
    culture: 'New York',
    images: ['/product-2a.jpg', '/product-2b.jpg'],
    description: 'Limited edition hip-hop vinyl straight from Brooklyn'
  },
  {
    id: 'p3',
    name: 'Lagos Beats Headphones',
    price: 129.99,
    category: 'accessories',
    culture: 'Lagos',
    images: ['/product-3a.jpg', '/product-3b.jpg'],
    description: 'Experience Afrobeats like never before'
  },
  {
    id: 'p4',
    name: 'Seoul Streetwear Jacket',
    price: 149.99,
    category: 'fashion',
    culture: 'Seoul',
    images: ['/product-4a.jpg', '/product-4b.jpg'],
    description: 'K-pop inspired fashion statement piece'
  },
  {
    id: 'p5',
    name: 'Tokyo Techno Vinyl',
    price: 34.99,
    category: 'music',
    culture: 'Tokyo',
    images: ['/product-5a.jpg', '/product-5b.jpg'],
    description: 'Cutting-edge electronic music from Tokyo\'s underground scene'
  },
  {
    id: 'p6',
    name: 'New York Cap',
    price: 39.99,
    category: 'accessories',
    culture: 'New York',
    images: ['/product-6a.jpg', '/product-6b.jpg'],
    description: 'Classic New York streetwear cap'
  },
  {
    id: 'p7',
    name: 'Lagos Pattern Tee',
    price: 49.99,
    category: 'fashion',
    culture: 'Lagos',
    images: ['/product-7a.jpg', '/product-7b.jpg'],
    description: 'Vibrant t-shirt with traditional Nigerian patterns'
  },
  {
    id: 'p8',
    name: 'Seoul K-Pop Album',
    price: 24.99,
    category: 'music',
    culture: 'Seoul',
    images: ['/product-8a.jpg', '/product-8b.jpg'],
    description: 'Limited edition K-Pop album with exclusive photobook'
  },
  {
    id: 'p9',
    name: 'London Club Jacket',
    price: 129.99,
    category: 'fashion',
    culture: 'London',
    images: ['/product-9a.jpg', '/product-9b.jpg'],
    description: 'Stylish jacket inspired by London\'s electronic music scene',
    isFeatured: true
  },
  {
    id: 'p10',
    name: 'London Underground Beanie',
    price: 29.99,
    category: 'accessories',
    culture: 'London',
    images: ['/product-10a.jpg', '/product-10b.jpg'],
    description: 'Keep warm with this London Underground inspired beanie'
  },
  {
    id: 'p11',
    name: 'London Beats Vinyl',
    price: 39.99,
    category: 'music',
    culture: 'London',
    images: ['/product-11a.jpg', '/product-11b.jpg'],
    description: 'Limited edition drum and bass vinyl from London\'s top producers'
  },
  // More products would be added here
];

const categories = ['All', 'Fashion', 'Music', 'Accessories'];
const cultures = ['All', 'Tokyo', 'New York', 'Lagos', 'Seoul', 'London'];

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCulture, setSelectedCulture] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const { setCulture } = useThemeStore();
  const [searchParams] = useSearchParams();
  
  // Apply filters
  useEffect(() => {
    let filtered = allProducts;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    if (selectedCulture !== 'All') {
      filtered = filtered.filter(product => product.culture === selectedCulture);
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, selectedCulture]);

  // Handle URL parameters for filtering
  useEffect(() => {
    const cultureParam = searchParams.get('culture');
    if (cultureParam && cultures.includes(cultureParam)) {
      handleCultureChange(cultureParam);
    }
  }, [searchParams]);

  // Handle culture change and update theme
  const handleCultureChange = (culture: string) => {
    setSelectedCulture(culture);
    
    // Update the theme based on culture selection
    if (culture === 'All') {
      setCulture('default');
    } else if (culture === 'New York') {
      setCulture('newyork');
    } else {
      // For Tokyo, Lagos, Seoul, London - lowercase the culture name
      setCulture(culture.toLowerCase() as any);
    }
  };

  useEffect(() => {
    // Set page title
    document.title = "Shop | CultureDrop";
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <section className="py-12 px-4 bg-secondary/50">
        <div className="container mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Shop</h1>
            <p className="text-muted-foreground">Discover products from cultures around the world</p>
          </div>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-between items-center mb-8">
            <div className="mb-4 lg:mb-0">
              <h2 className="text-xl font-medium">
                {filteredProducts.length} Products
              </h2>
            </div>
            
            <div className="flex justify-between w-full lg:w-auto">
              <Button 
                variant="outline" 
                className="lg:hidden flex items-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? (
                  <>
                    <X className="h-4 w-4 mr-2" /> Hide Filters
                  </>
                ) : (
                  <>
                    <Filter className="h-4 w-4 mr-2" /> Show Filters
                  </>
                )}
              </Button>
              
              <div className="flex space-x-2">
                <select 
                  className="px-4 py-2 rounded-md border border-input bg-background"
                  value={selectedCulture}
                  onChange={(e) => handleCultureChange(e.target.value)}
                >
                  {cultures.map(culture => (
                    <option key={culture} value={culture}>{culture}</option>
                  ))}
                </select>
                
                <select
                  className="px-4 py-2 rounded-md border border-input bg-background"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters sidebar - hidden on mobile unless toggled */}
            <motion.div
              className={`lg:block ${showFilters ? 'block' : 'hidden'}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: showFilters ? 1 : 0,
                height: showFilters ? 'auto' : 0
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="font-medium mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category} className="flex items-center">
                      <input
                        type="radio"
                        id={`category-${category}`}
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="mr-2"
                      />
                      <label htmlFor={`category-${category}`}>{category}</label>
                    </div>
                  ))}
                </div>
                
                <h3 className="font-medium mb-4 mt-8">Cultures</h3>
                <div className="space-y-2">
                  {cultures.map(culture => (
                    <div key={culture} className="flex items-center">
                      <input
                        type="radio"
                        id={`culture-${culture}`}
                        name="culture"
                        checked={selectedCulture === culture}
                        onChange={() => handleCultureChange(culture)}
                        className="mr-2"
                      />
                      <label htmlFor={`culture-${culture}`}>{culture}</label>
                    </div>
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  className="w-full mt-8"
                  onClick={() => {
                    setSelectedCategory('All');
                    handleCultureChange('All');
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </motion.div>

            {/* Product grid */}
            <div className="lg:col-span-3">
              <ProductGrid products={filteredProducts} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopPage;
