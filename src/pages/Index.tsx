import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/hero/HeroSection';
import ProductGrid from '@/components/product/ProductGrid';
import CultureSelector from '@/components/ui/culture-selector';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useThemeStore } from '@/store/useThemeStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { fetchProducts } from '@/lib/api';
import { featuredProducts as fallbackFeaturedProducts } from '@/lib/mockData';
import ProductCard from '@/components/product/ProductCard';
import { getTranslation } from '@/lib/translations';
import LanguageSelector from '@/components/ui/LanguageSelector';
import LocalizedMeta from '@/components/ui/LocalizedMeta';

const HomePage = () => {
  const { darkMode, toggleDarkMode } = useThemeStore();
  const { language } = useLanguageStore();
  const [featuredProducts, setFeaturedProducts] = useState(fallbackFeaturedProducts || []);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  // Fetch featured products from API
  useEffect(() => {
    const getFeaturedProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts();
        console.log('Fetched products:', products); // Debug log
        
        // Filter featured products or take the first 4 products if none are featured
        let featured = products.filter(product => product.isFeatured === true);
        
        // If no featured products found, take the first 4 products
        if (featured.length === 0) {
          console.log('No featured products found, using first 4 products');
          featured = products.slice(0, 4);
        } else if (featured.length > 4) {
          // Limit to 4 featured products
          console.log('Limiting to 4 featured products');
          featured = featured.slice(0, 4);
        }
        
        console.log('Featured products:', featured); // Debug log
        setFeaturedProducts(featured);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
        
        // Fall back to hard-coded featured products
        console.log('Using fallback featured products (limited to 4)');
        setFeaturedProducts(fallbackFeaturedProducts.slice(0, 4));
      }
    };
    
    getFeaturedProducts();
  }, []);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log('Subscribed with email:', email);
    setSubscribed(true);
    setEmail('');
    
    // Reset the success message after 5 seconds
    setTimeout(() => {
      setSubscribed(false);
    }, 5000);
  };

  return (
    <>
      <LocalizedMeta 
        titleKey="home"
        descriptionKey="storeDescription"
        canonicalPath="/"
      />
      
      <HeroSection />
      
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold">{getTranslation('featuredProducts', language)}</h2>
            <p className="text-muted-foreground mt-2">{getTranslation('curatedItems', language)}</p>
          </motion.div>
          
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id || `product-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/shop">
                {getTranslation('viewAllProducts', language)}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-secondary/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold">{getTranslation('yourStyleYourChoice', language)}</h2>
            <p className="text-muted-foreground mt-2">{getTranslation('selectCultureTheme', language)}</p>
            <div className="mt-4 flex justify-center items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleDarkMode}
                className="text-sm"
              >
                {darkMode ? getTranslation('lightMode', language) : getTranslation('darkMode', language)}
              </Button>
              <p className="text-sm text-muted-foreground">{getTranslation('chooseTheme', language)}</p>
            </div>
          </motion.div>
          
          <CultureSelector />
          
          <div className="mt-8 flex justify-center">
            <LanguageSelector variant="buttons" size="md" />
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild className="bg-culture text-culture-foreground hover:bg-culture/90" size="lg">
              <Link to="/cultures">
                {getTranslation('exploreAllCultures', language)}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center max-w-2xl"
            >
              <div className="flex justify-center mb-8">
                <img 
                  src="/assets/logo/hypeheritage-logo.svg" 
                  alt="HypeHeritage Logo" 
                  className="h-40" 
                />
              </div>
              <h2 className="text-3xl font-bold mb-4">{getTranslation('whereMusicMeetsFashion', language)}</h2>
              <p className="text-muted-foreground mb-6">
                {getTranslation('storeDescription', language)}
              </p>
              <Button asChild variant="outline">
                <Link to="/about">
                  {getTranslation('aboutUs', language)}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">{getTranslation('subscribeNewsletter', language)}</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            {getTranslation('stayUpdated', language)}
          </p>
          
          {subscribed ? (
            <div className="max-w-md mx-auto p-4 bg-green-50 dark:bg-green-900/20 rounded-md text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
              <Check className="h-5 w-5" />
              <span>{getTranslation('thankSubscribing', language)}</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder={getTranslation('emailPlaceholder', language)}
                className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" className="w-full sm:w-auto">{getTranslation('subscribe', language)}</Button>
            </form>
          )}
        </div>
      </section>
    </>
  );
};

export default HomePage;
