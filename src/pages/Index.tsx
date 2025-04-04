
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/hero/HeroSection';
import ProductGrid from '@/components/product/ProductGrid';
import CultureSelector from '@/components/ui/culture-selector';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Mock featured products - this would come from an API in a real app
const featuredProducts = [
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
  }
];

const HomePage = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = "CultureDrop | Music & Fashion Concept Shop";
  }, []);

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
          
          <ProductGrid products={featuredProducts} />
          
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
            <h2 className="text-3xl font-bold">Explore Cultures</h2>
            <p className="text-muted-foreground mt-2">Discover products inspired by urban cultures around the world</p>
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
          
          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
              required
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
    </>
  );
};

export default HomePage;
