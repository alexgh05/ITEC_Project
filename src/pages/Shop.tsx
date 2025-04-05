import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import ProductGrid from '@/components/product/ProductGrid';
import { Filter, X, Music, ShoppingBag, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/store/useThemeStore';
import { fetchProducts } from '@/lib/api';

const categories = ['All', 'Music', 'Accessories', 'Footwear', 'Fashion'];
const cultures = ['All', 'Tokyo', 'New York', 'Lagos', 'Seoul', 'London', 'Berlin'];
const genders = ['All', 'Male', 'Female', 'Unisex'];

// Featured category cards
const featuredCategories = [
  {
    id: 'music',
    name: 'Music',
    description: 'Vinyl records, digital releases, and mixtapes',
    icon: Music,
    image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Streetwear, limited editions, and cultural apparel',
    icon: ShoppingBag,
    image: 'https://images.unsplash.com/photo-1503341733017-1901578f9f1e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Complete your look with unique cultural pieces',
    icon: Package,
    image: '/uploads/accessories_background.png'
  },
  {
    id: 'footwear',
    name: 'Footwear',
    description: 'Stylish footwear for every culture',
    icon: ShoppingBag,
    image: '/uploads/footwear_background.png'
  }
];

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCulture, setSelectedCulture] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setCulture } = useThemeStore();
  const [searchParams] = useSearchParams();
  
  // Fetch products from API
  useEffect(() => {
    const getProductsData = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts(
          selectedCategory !== 'All' ? selectedCategory.toLowerCase() : undefined,
          selectedCulture !== 'All' ? selectedCulture : undefined,
          selectedGender !== 'All' ? selectedGender.toLowerCase() : undefined
        );
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    
    getProductsData();
  }, [selectedCategory, selectedCulture, selectedGender]);

  // Handle URL parameters for filtering
  useEffect(() => {
    const cultureParam = searchParams.get('culture');
    if (cultureParam) {
      // Find matching culture in the cultures array (case-insensitive)
      const matchingCulture = cultures.find(c => 
        c.toLowerCase() === cultureParam.toLowerCase() ||
        (c === 'New York' && cultureParam.toLowerCase() === 'newyork')
      );
      
      if (matchingCulture) {
        handleCultureChange(matchingCulture);
      }
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
      // For Tokyo, Lagos, Seoul, London, Berlin - lowercase the culture name
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

      {/* Featured Categories */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="group relative h-64 overflow-hidden rounded-lg shadow-md"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <category.icon className="text-white mb-2 h-6 w-6" />
                  <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                  <p className="text-white/80 text-sm mb-4">{category.description}</p>
                  <Button asChild variant="outline" className="bg-background/10 backdrop-blur-sm border-white/20 text-white hover:bg-white hover:text-black transition-colors">
                    <Link to={`/shop/${category.id.toLowerCase()}`}>
                      Browse {category.name}
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-between items-center mb-8">
            <div className="mb-4 lg:mb-0">
              <h2 className="text-xl font-medium">
                {loading ? 'Loading products...' : `${filteredProducts.length} Products`}
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
                    <X className="mr-2 h-4 w-4" />
                    Hide Filters
                  </>
                ) : (
                  <>
                    <Filter className="mr-2 h-4 w-4" />
                    Show Filters
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className={`lg:w-1/4 lg:block ${showFilters ? 'block' : 'hidden'}`}>
              <div className="bg-card border rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium mb-4">Filters</h3>
                
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Category</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <label key={category} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="mr-2"
                        />
                        {category}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Culture</h4>
                  <div className="space-y-2">
                    {cultures.map(culture => (
                      <label key={culture} className="flex items-center">
                        <input
                          type="radio"
                          name="culture"
                          checked={selectedCulture === culture}
                          onChange={() => handleCultureChange(culture)}
                          className="mr-2"
                        />
                        {culture}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Gender</h4>
                  <div className="space-y-2">
                    {genders.map(gender => (
                      <label key={gender} className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          checked={selectedGender === gender}
                          onChange={() => setSelectedGender(gender)}
                          className="mr-2"
                        />
                        {gender}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-3/4">
              {loading ? (
                <div className="flex justify-center items-center h-[400px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredProducts.length > 0 ? (
                <ProductGrid products={filteredProducts} />
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <h3 className="text-xl mb-2">No products found</h3>
                  <p className="text-muted-foreground">
                    Try changing your filters to see more products
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopPage;
