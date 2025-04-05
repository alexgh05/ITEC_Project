import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Filter, SlidersHorizontal, Check } from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';
import { fetchProducts } from '@/lib/api';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Map category slugs to display names
const categoryDisplayNames = {
  'music': 'Music',
  'fashion': 'Fashion',
  'accessories': 'Accessories'
};

// Culture mapping between display names and values
const cultureMap = {
  'Tokyo': 'tokyo',
  'New York': 'newyork',
  'Lagos': 'lagos',
  'Seoul': 'seoul'
};

// Product types for type safety
interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  culture: string;
  category: string;
  images: string[];
  description: string;
  [key: string]: any;
}

const ShopCategory = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [minPriceInput, setMinPriceInput] = useState("0");
  const [maxPriceInput, setMaxPriceInput] = useState("200");
  const [selectedCultures, setSelectedCultures] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Sort state
  const [sortOption, setSortOption] = useState<string>('default');
  
  // Available cultures for display (with proper capitalization)
  const cultures = ['Tokyo', 'New York', 'Lagos', 'Seoul'];
  
  // Get the display name for the category
  const categoryName = category ? categoryDisplayNames[category] || category : '';
  
  useEffect(() => {
    // Set page title
    document.title = `${categoryName} | CultureDrop Shop`;
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Fetch products filtered by category
    const getProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await fetchProducts();
        
        // Filter products by category
        const categoryProducts = allProducts.filter(product => 
          product.category && product.category.toLowerCase() === category?.toLowerCase()
        );
        
        // Log products for debugging
        console.log("Fetched products:", categoryProducts);
        categoryProducts.forEach(product => {
          console.log(`Product: ${product.name}, Culture: ${product.culture}`);
        });
        
        setProducts(categoryProducts);
        setFilteredProducts(categoryProducts);
        setLoading(false);
      } catch (error) {
        console.error(`Error fetching ${category} products:`, error);
        setLoading(false);
      }
    };
    
    getProducts();
  }, [category, categoryName]);
  
  // Apply filters and sorting whenever filter options change
  useEffect(() => {
    if (products.length === 0) return;
    
    // Start with products filtered by category
    let result = [...products];
    
    // Apply price filter
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply culture filter if any cultures are selected
    if (selectedCultures.length > 0) {
      result = result.filter(product => {
        // Map display culture names to the values stored in product data
        const selectedValues = selectedCultures.map(c => cultureMap[c].toLowerCase());
        
        // Ensure product culture is lowercase for case-insensitive comparison
        const productCulture = product.culture?.toLowerCase();
        
        // Debug logs (can be removed in production)
        console.log("Product:", product.name, "Culture:", productCulture);
        console.log("Selected values:", selectedValues);
        
        return selectedValues.includes(productCulture);
      });
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-a-z':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-z-a':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Leave in default order
        break;
    }
    
    // Log filtered results
    console.log("Filter applied:", {
      selectedCultures,
      priceRange,
      resultCount: result.length
    });
    
    if (result.length === 0 && selectedCultures.length > 0) {
      console.log("No results after filtering by culture. Check culture values in products and mapping.");
    }
    
    setFilteredProducts(result);
  }, [products, priceRange, selectedCultures, sortOption]);
  
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPriceInput(value);
    
    // Only update the actual filter if the value is a valid number or empty
    if (value === "") {
      setPriceRange([0, priceRange[1]]);
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        setPriceRange([numValue, priceRange[1]]);
      }
    }
  };
  
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPriceInput(value);
    
    // Only update the actual filter if the value is a valid number or empty
    if (value === "") {
      setPriceRange([priceRange[0], 200]);
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        setPriceRange([priceRange[0], numValue]);
      }
    }
  };
  
  const toggleCulture = (culture: string) => {
    console.log("Toggling culture:", culture);
    
    setSelectedCultures(prev => {
      // Check if this culture is already selected
      if (prev.includes(culture)) {
        // Remove it if it's already selected
        console.log(`Removing ${culture} from selected cultures`);
        return prev.filter(c => c !== culture);
      } else {
        // Add it if it's not selected
        console.log(`Adding ${culture} to selected cultures`);
        return [...prev, culture];
      }
    });
  };
  
  const clearFilters = () => {
    setPriceRange([0, 200]);
    setMinPriceInput("0");
    setMaxPriceInput("200");
    setSelectedCultures([]);
  };
  
  return (
    <>
      <section className="py-12 px-4 bg-secondary/50">
        <div className="container mx-auto">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="flex items-center text-muted-foreground hover:text-foreground"
            >
              <Link to="/shop">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Products
              </Link>
            </Button>
          </div>
          
          <h1 className="text-4xl font-bold">{categoryName}</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            {category === 'music' && 'Discover vinyl records, digital releases, and mixtapes from global urban scenes.'}
            {category === 'fashion' && 'Explore streetwear, limited edition apparel, and cultural fashion statements.'}
            {category === 'accessories' && 'Complete your style with unique accessories influenced by global urban cultures.'}
          </p>
        </div>
      </section>
      
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <h2 className="text-2xl font-bold">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
            </h2>
            
            <div className="flex items-center gap-2">
              <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-black text-white border-zinc-700 hover:bg-zinc-800 hover:text-white">
                    <Filter className="h-4 w-4" />
                    Filter
                    {(selectedCultures.length > 0 || priceRange[0] > 0 || priceRange[1] < 200) && (
                      <span className="ml-1 h-2 w-2 rounded-full bg-white"></span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 bg-black border-zinc-700 text-white rounded-xl" side="bottom" align="end" sideOffset={5}>
                  <div className="p-4 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-base">Filters</h3>
                      <button 
                        onClick={clearFilters} 
                        className="text-sm text-zinc-400 hover:text-white"
                      >
                        Clear all
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Price Range</h4>
                      <div className="flex flex-row gap-4">
                        <div className="w-1/2 space-y-1">
                          <label className="text-xs text-zinc-400">Min ($)</label>
                          <input
                            type="text" 
                            inputMode="numeric"
                            value={minPriceInput}
                            onChange={handleMinPriceChange}
                            className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-md px-3 py-2 text-sm"
                          />
                        </div>
                        <div className="w-1/2 space-y-1">
                          <label className="text-xs text-zinc-400">Max ($)</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={maxPriceInput}
                            onChange={handleMaxPriceChange}
                            className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-md px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Culture</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {cultures.map((culture) => (
                          <button
                            key={culture}
                            onClick={() => toggleCulture(culture)}
                            className={`py-2 px-4 rounded-md text-sm text-center transition-colors ${
                              selectedCultures.includes(culture) 
                                ? 'bg-white text-black font-medium' 
                                : 'bg-zinc-900 text-white border border-zinc-700 hover:bg-zinc-800'
                            }`}
                          >
                            {selectedCultures.includes(culture) && (
                              <Check className="h-3 w-3 inline-block mr-1" />
                            )}
                            {culture}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      className="w-full py-3 bg-white text-black font-medium rounded-md hover:bg-zinc-200"
                      onClick={() => setFilterOpen(false)}
                    >
                      Apply Filters
                    </button>
                  </div>
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-black text-white border-zinc-700 hover:bg-zinc-800 hover:text-white">
                    <SlidersHorizontal className="h-4 w-4" />
                    Sort
                    {sortOption !== 'default' && (
                      <span className="ml-1 h-2 w-2 rounded-full bg-white"></span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-black border-zinc-700 text-white">
                  <DropdownMenuItem 
                    onClick={() => setSortOption('default')}
                    className="hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white"
                  >
                    Default
                    {sortOption === 'default' && <Check className="ml-2 h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption('price-low-high')}
                    className="hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white"
                  >
                    Price: Low to High
                    {sortOption === 'price-low-high' && <Check className="ml-2 h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption('price-high-low')}
                    className="hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white"
                  >
                    Price: High to Low
                    {sortOption === 'price-high-low' && <Check className="ml-2 h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption('rating')}
                    className="hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white"
                  >
                    Top Rated
                    {sortOption === 'rating' && <Check className="ml-2 h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption('name-a-z')}
                    className="hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white"
                  >
                    Name: A to Z
                    {sortOption === 'name-a-z' && <Check className="ml-2 h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption('name-z-a')}
                    className="hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white"
                  >
                    Name: Z to A
                    {sortOption === 'name-z-a' && <Check className="ml-2 h-4 w-4" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ProductGrid products={filteredProducts} />
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl mb-4">No products found</h3>
              <p className="text-muted-foreground mb-8">
                Try adjusting your filters or browse other categories.
              </p>
              <Button asChild>
                <Link to="/shop">View All Products</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ShopCategory; 