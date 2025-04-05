import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/hero/HeroSection';
import ProductGrid from '@/components/product/ProductGrid';
import CultureSelector from '@/components/ui/culture-selector';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useThemeStore } from '@/store/useThemeStore';
import { fetchProducts } from '@/lib/api';

const HomePage = () => {
  const { darkMode, toggleDarkMode } = useThemeStore();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  // Fetch featured products from API
  useEffect(() => {
    const getFeaturedProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts();
        // Filter featured products or take the first 4 products
        const featured = products.filter(product => product.isFeatured) || products.slice(0, 4);
        setFeaturedProducts(featured);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setLoading(false);
      }
    };
    
    getFeaturedProducts();
  }, []);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = "CultureDrop | Music & Fashion Concept Shop";
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
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
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground mt-2">Curated items from our latest collections</p>
          </motion.div>
          
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ProductGrid products={featuredProducts} />
          )}
          
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/shop">
                View All Products
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
            <h2 className="text-3xl font-bold">Your Style, Your Choice</h2>
            <p className="text-muted-foreground mt-2">Select a culture theme to customize your shopping experience</p>
            <div className="mt-4 flex justify-center items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleDarkMode}
                className="text-sm"
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </Button>
              <p className="text-sm text-muted-foreground">Choose your theme below</p>
            </div>
          </motion.div>
          
          <CultureSelector />
          
          <div className="mt-12 text-center">
            <Button asChild className="bg-culture text-culture-foreground hover:bg-culture/90" size="lg">
              <Link to="/cultures">
                Explore All Cultures
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-3xl font-bold mb-4">Where Music Meets Fashion</h2>
              <p className="text-muted-foreground mb-6">
                CultureDrop is more than just a store. We're a platform that celebrates the intersection of music and fashion across different urban cultures.
              </p>
              <Button asChild variant="outline">
                <Link to="/about">
                  About Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="aspect-video bg-muted rounded-lg overflow-hidden"
            >
              {/* This would be replaced with an actual image in a real app */}
              <div className="w-full h-full bg-gradient-to-br from-culture to-culture-accent/50" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Subscribe to Our Newsletter</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Stay updated with the latest drops, exclusive offers, and cultural insights.
          </p>
          
          {subscribed ? (
            <div className="max-w-md mx-auto p-4 bg-green-50 dark:bg-green-900/20 rounded-md text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
              <Check className="h-5 w-5" />
              <span>Thanks for subscribing! We'll keep you updated.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit">Subscribe</Button>
            </form>
          )}
        </div>
      </section>
    </>
  );
};

export default HomePage;
