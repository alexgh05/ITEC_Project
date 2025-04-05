import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import CultureSelector from '@/components/ui/culture-selector';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Music, Hash } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';

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

const CulturesPage = () => {
  const location = useLocation();
  const { setCulture } = useThemeStore();
  const cultureRefs = useRef<Record<string, HTMLElement | null>>({});
  
  // Extract culture from URL path if present
  const currentPath = location.pathname;
  const selectedCulture = currentPath.includes('/cultures/') 
    ? currentPath.split('/cultures/')[1] 
    : null;

  useEffect(() => {
    // Set page title
    document.title = selectedCulture 
      ? `${selectedCulture.charAt(0).toUpperCase() + selectedCulture.slice(1)} Culture | CultureDrop`
      : "Cultures | CultureDrop";
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // If a specific culture is selected in the URL
    if (selectedCulture && cultureInfo.some(c => c.id === selectedCulture)) {
      // Slight delay to ensure the page has rendered
      setTimeout(() => {
        // Scroll to the selected culture section
        if (cultureRefs.current[selectedCulture]) {
          cultureRefs.current[selectedCulture]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // Update the active culture theme
          setCulture(selectedCulture);
        }
      }, 300);
    }
  }, [selectedCulture, setCulture]);

  return (
    <>
      <section className="py-12 px-4 bg-secondary/50">
        <div className="container mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Urban Cultures</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the diverse urban cultures that inspire our collections. 
              Each culture brings its unique music, fashion, and artistic expressions.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Select a Culture</h2>
          <CultureSelector />
        </div>
      </section>

      {cultureInfo.map((culture, index) => (
        <motion.section
          key={culture.id}
          ref={el => cultureRefs.current[culture.id] = el}
          id={`culture-${culture.id}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className={`py-16 px-4 ${index % 2 === 1 ? 'bg-secondary/50' : ''}`}
        >
          <div className="container mx-auto">
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
              index % 2 === 1 ? 'md:flex-row-reverse' : ''
            }`}>
              <div 
                className={`aspect-[4/3] bg-muted rounded-lg overflow-hidden ${
                  index % 2 === 1 ? 'md:order-2' : ''
                }`}
              >
                {/* 
                  Culture image - To update:
                  1. Place a new image named "{culture.id}.jpg" in the public/cultures/ directory
                  2. Recommended size: 800x600px or similar aspect ratio (4:3)
                */}
                <img 
                  src={`/cultures/${culture.id}.jpg`}
                  alt={`${culture.name} Culture`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log("Image load error, falling back to gradient");
                    const target = e.target as HTMLImageElement;
                    const parent = target.parentElement;
                    if (parent) {
                      // Create gradient div as fallback
                      const fallback = document.createElement('div');
                      fallback.className = `w-full h-full bg-gradient-to-br from-culture to-culture-accent/50 culture-${culture.id}`;
                      parent.appendChild(fallback);
                      // Hide the broken image
                      target.style.display = 'none';
                    }
                  }}
                />
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
      ))}
    </>
  );
};

export default CulturesPage;
