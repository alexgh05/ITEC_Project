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
import { useThemeStore } from '@/store/useThemeStore';
import { useAudio } from '@/providers/ThemeProvider';

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
  'Seoul': 'seoul',
  'London': 'london',
  'Berlin': 'berlin'
};

// Gender options
const genders = ['Male', 'Female', 'Unisex'];

// Product types for type safety
interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  culture: string;
  category: string;
  gender: string;
  images: string[];
  description: string;
  [key: string]: any;
}

// Available cultures for display (with proper capitalization)
const cultures = ['Tokyo', 'New York', 'Lagos', 'Seoul', 'London', 'Berlin'];

const ShopCategory = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { setCulture } = useThemeStore();
  const { audioRef, isPlaying } = useAudio();
  
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [minPriceInput, setMinPriceInput] = useState("0");
  const [maxPriceInput, setMaxPriceInput] = useState("200");
  const [selectedCultures, setSelectedCultures] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Sort state
  const [sortOption, setSortOption] = useState<string>('default');
  
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
          console.log(`Product: ${product.name}, Culture: ${product.culture}, Gender: ${product.gender}`);
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
    
    // Cleanup when unmounting
    return () => {
      // Stop Berlin audio if it's playing when leaving the page
      const berlinAudio = document.getElementById('berlin-audio') as HTMLAudioElement;
      if (berlinAudio && !berlinAudio.paused) {
        berlinAudio.pause();
      }
    };
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
    
    // Apply gender filter if any genders are selected
    if (selectedGenders.length > 0) {
      result = result.filter(product => {
        // For gender filter - convert everything to lowercase for case-insensitive comparison
        const selectedGenderValues = selectedGenders.map(g => g.toLowerCase());
        const productGender = product.gender?.toLowerCase();
        
        return selectedGenderValues.includes(productGender);
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
      selectedGenders,
      priceRange,
      resultCount: result.length
    });
    
    if (result.length === 0 && (selectedCultures.length > 0 || selectedGenders.length > 0)) {
      console.log("No results after filtering. Check values in products and mapping.");
    }
    
    setFilteredProducts(result);
  }, [products, priceRange, selectedCultures, selectedGenders, sortOption]);
  
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
    
    // Handle culture theme changes
    if (culture === 'Berlin') {
      // Handle Berlin special case
      const isBeingAdded = !selectedCultures.includes(culture);
      
      if (isBeingAdded) {
        // Berlin is being added to filter
        setCulture('berlin');
        
        // Special handling for Berlin audio
        try {
          // First, stop the default audio from ThemeProvider
          if (audioRef?.current && !audioRef.current.paused) {
            audioRef.current.pause();
          }
          
          // Get or create Berlin audio element
          let berlinAudio = document.getElementById('berlin-audio') as HTMLAudioElement;
          if (!berlinAudio) {
            berlinAudio = document.createElement('audio');
            berlinAudio.id = 'berlin-audio';
            berlinAudio.src = '/audio/berlin-techno.mp3';
            berlinAudio.volume = 0.3;
            berlinAudio.loop = true;
            document.body.appendChild(berlinAudio);
          }
          
          // Reset the audio to start from the beginning
          berlinAudio.currentTime = 0;
          
          // Play Berlin audio if global audio is playing
          if (isPlaying) {
            berlinAudio.play()
              .then(() => console.log('Berlin audio playing in shop category'))
              .catch(err => console.error('Berlin audio play error in shop category:', err));
          }
        } catch (error) {
          console.error('Error handling Berlin audio in shop category:', error);
        }
      } else {
        // Berlin is being removed
        setCulture('default');
        
        // Stop Berlin audio if it's playing
        const berlinAudio = document.getElementById('berlin-audio') as HTMLAudioElement;
        if (berlinAudio && !berlinAudio.paused) {
          berlinAudio.pause();
        }
      }
    } else {
      // For other cultures
      // If Berlin was previously selected, stop its audio
      if (selectedCultures.includes('Berlin')) {
        const berlinAudio = document.getElementById('berlin-audio') as HTMLAudioElement;
        if (berlinAudio && !berlinAudio.paused) {
          berlinAudio.pause();
        }
      }
      
      // Set appropriate culture theme based on selection
      const cultureThemes = selectedCultures.filter(c => c !== 'Berlin');
      if (cultureThemes.length === 0 && !selectedCultures.includes(culture)) {
        // This culture is being added and no other cultures are selected
        setCulture(cultureMap[culture].toLowerCase() as any);
      } else if (cultureThemes.length === 1 && selectedCultures.includes(culture)) {
        // This culture is being removed and it's the only one
        setCulture('default');
      }
    }
    
    // Update selected cultures list
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
  
  const toggleGender = (gender: string) => {
    console.log("Toggling gender:", gender);
    
    setSelectedGenders(prev => {
      // Check if this gender is already selected
      if (prev.includes(gender)) {
        // Remove it if it's already selected
        console.log(`Removing ${gender} from selected genders`);
        return prev.filter(g => g !== gender);
      } else {
        // Add it if it's not selected
        console.log(`Adding ${gender} to selected genders`);
        return [...prev, gender];
      }
    });
  };
  
  const clearFilters = () => {
    setPriceRange([0, 200]);
    setMinPriceInput("0");
    setMaxPriceInput("200");
    setSelectedCultures([]);
    setSelectedGenders([]);
  };
  
  return (
    <>
      <section className="py-12 px-4 bg-secondary/50">
        <div className="container mx-auto max-w-full px-4 sm:px-6 lg:px-8">
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
          
          <h1 className="text-3xl md:text-4xl font-bold">{categoryName}</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            {category === 'music' && 'Discover vinyl records, digital releases, and mixtapes from global urban scenes.'}
            {category === 'fashion' && 'Explore streetwear, limited edition apparel, and cultural fashion statements.'}
            {category === 'accessories' && 'Complete your style with unique accessories influenced by global urban cultures.'}
          </p>
        </div>
      </section>
      
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <h2 className="text-2xl font-bold">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
            </h2>
            
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-black text-white border-zinc-700 hover:bg-zinc-800 hover:text-white w-full sm:w-auto">
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

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Gender</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {genders.map((gender) => (
                          <button
                            key={gender}
                            onClick={() => toggleGender(gender)}
                            className={`py-2 px-4 rounded-md text-sm text-center transition-colors ${
                              selectedGenders.includes(gender) 
                                ? 'bg-white text-black font-medium' 
                                : 'bg-zinc-900 text-white border border-zinc-700 hover:bg-zinc-800'
                            }`}
                          >
                            {selectedGenders.includes(gender) && (
                              <Check className="h-3 w-3 inline-block mr-1" />
                            )}
                            {gender}
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
                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-black text-white border-zinc-700 hover:bg-zinc-800 hover:text-white whitespace-nowrap">
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