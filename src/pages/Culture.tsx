import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Music, Hash, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/store/useThemeStore';

// Use the same culture information from the Cultures page
const cultureInfo = [
  {
    id: 'tokyo',
    name: 'Tokyo',
    description: "The electric atmosphere of Tokyo blends traditional Japanese aesthetics with futuristic tech culture. From Harajuku fashion to Akihabara gadgets, Tokyo's urban landscape creates a unique style that inspires musicians and fashion designers worldwide.",
    musicGenres: ['J-Pop', 'City Pop', 'Japanese Techno', 'Future Bass'],
    fashionStyles: ['Harajuku', 'Techwear', 'Kawaii', 'Cyberpunk Streetwear']
  },
  {
    id: 'newyork',
    name: 'New York',
    description: "The birthplace of hip-hop and a melting pot of global influences, New York City continues to drive youth culture through its gritty, authentic street styles. From the Bronx to Brooklyn, NYC's diverse neighborhoods have spawned countless music and fashion movements.",
    musicGenres: ['Hip-Hop', 'NY House', 'Indie Rock', 'Jazz Fusion'],
    fashionStyles: ['Urban Streetwear', 'Vintage NYC', 'Modern Preppy', 'Brooklyn Artisan']
  },
  {
    id: 'lagos',
    name: 'Lagos',
    description: "Nigeria's largest city pulses with creative energy, drawing from rich cultural traditions while pushing boldly forward. The Afrobeats revolution emerged from Lagos, alongside vibrant fashion that combines traditional patterns with contemporary silhouettes.",
    musicGenres: ['Afrobeats', 'Afrofusion', 'Highlife', 'Alté'],
    fashionStyles: ['Modern African', 'Lagos Streetwear', 'Traditional Prints', 'Afrofuturism']
  },
  {
    id: 'seoul',
    name: 'Seoul',
    description: "As the epicenter of K-pop and K-drama global phenomena, Seoul represents the perfect blend of technological innovation and heritage. The city's fashion scene emphasizes impeccable style and trend-setting looks that influence global youth culture.",
    musicGenres: ['K-Pop', 'K-Hip-Hop', 'Korean Indie', 'Seoul Electronic'],
    fashionStyles: ['K-Fashion', 'Minimalist Korean', 'Seoul Street', 'Modern Hanbok Fusion']
  },
  {
    id: 'london',
    name: 'London',
    description: "London's cultural scene is defined by its diversity and innovation, blending heritage with cutting-edge trends. From UK grime to punk rock revival, London's music shapes global sounds, while its fashion scene combines traditional British tailoring with bold streetwear and avant-garde design.",
    musicGenres: ['UK Drill', 'Grime', 'British Rock', 'London Electronic'],
    fashionStyles: ['British Streetwear', 'Modern Punk', 'London Tailoring', 'Urban Goth']
  },
  {
    id: 'berlin',
    name: 'Berlin',
    description: "As Europe's creative capital, Berlin embodies a raw, experimental ethos shaped by its complex history. The city's legendary techno scene and club culture have influenced music worldwide, while its fashion approach combines minimalism with industrial aesthetics and sustainable design principles.",
    musicGenres: ['Techno', 'Electronic', 'Experimental', 'German Hip-Hop'],
    fashionStyles: ['Berlin Minimalism', 'Techno Club Wear', 'Industrial Style', 'Eco Fashion']
  }
];

const CulturePage = () => {
  const { cultureId } = useParams<{ cultureId: string }>();
  const navigate = useNavigate();
  const { setCulture } = useThemeStore();
  
  // Find the culture data based on the URL parameter
  const culture = cultureInfo.find(c => c.id === cultureId);
  
  useEffect(() => {
    // If culture doesn't exist, redirect to main cultures page
    if (!culture) {
      navigate('/cultures');
      return;
    }
    
    // Set page title
    document.title = `${culture.name} Culture | CultureDrop`;
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set the active culture theme
    setCulture(culture.id);
    
    // Clean up - reset culture when leaving
    return () => {
      setCulture('default');
    };
  }, [culture, cultureId, navigate, setCulture]);
  
  if (!culture) {
    return null; // Will redirect in the useEffect
  }
  
  return (
    <>
      <section className="py-12 px-4 bg-secondary/50">
        <div className="container mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/cultures')}
              className="flex items-center text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              All Cultures
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{culture.name}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the unique urban culture of {culture.name} and how it influences our collections.
            </p>
          </div>
        </div>
      </section>
      
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-16 px-4"
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
              {/* This would be a real image in a production app */}
              <div className={`w-full h-full bg-gradient-to-br from-culture to-culture-accent/50 culture-${culture.id}`} />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-4">{culture.name}</h2>
              <p className="text-muted-foreground mb-6">
                {culture.description}
              </p>
              
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <Music className="h-5 w-5 mr-2 text-culture" />
                  <h3 className="font-medium">Music Genres</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {culture.musicGenres.map(genre => (
                    <span 
                      key={genre} 
                      className="text-sm bg-secondary px-3 py-1 rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex items-center mb-2">
                  <Hash className="h-5 w-5 mr-2 text-culture" />
                  <h3 className="font-medium">Fashion Styles</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {culture.fashionStyles.map(style => (
                    <span 
                      key={style} 
                      className="text-sm bg-secondary px-3 py-1 rounded-full"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>
              
              <Button asChild className="bg-culture text-culture-foreground hover:bg-culture/90">
                <Link to={`/shop?culture=${culture.name}`}>
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Shop {culture.name} Products
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.section>
      
      <section className="py-16 px-4 bg-secondary/50">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Experience {culture.name} Culture</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Immerse yourself in the sounds, styles, and stories of {culture.name}.
            Our products are inspired by the authentic cultural expressions of this vibrant city.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button asChild variant="outline">
              <Link to="/shop">
                Browse All Products
              </Link>
            </Button>
            
            <Button asChild>
              <Link to="/cultures">
                Explore Other Cultures
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default CulturePage; 