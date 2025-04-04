import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Music, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore, CultureTheme } from '@/store/useThemeStore';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  image: string;
  culture: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Tokyo Nights Collection",
    subtitle: "Futuristic streetwear with neon aesthetics",
    cta: "Shop Tokyo",
    link: "/shop",
    image: "/hero-tokyo.jpg",
    culture: "tokyo"
  },
  {
    id: 2,
    title: "New York Underground",
    subtitle: "Urban hip-hop inspired fashion",
    cta: "Shop New York",
    link: "/shop",
    image: "/hero-newyork.jpg",
    culture: "newyork"
  },
  {
    id: 3,
    title: "Lagos Energy",
    subtitle: "Vibrant Afrobeats culture with bold patterns",
    cta: "Shop Lagos",
    link: "/shop",
    image: "/hero-lagos.jpg",
    culture: "lagos"
  },
  {
    id: 4,
    title: "Seoul K-Pop Scene",
    subtitle: "Cute and colorful Korean pop culture",
    cta: "Shop Seoul",
    link: "/shop",
    image: "/hero-seoul.jpg",
    culture: "seoul"
  },
  {
    id: 5,
    title: "London Electronic",
    subtitle: "Electronic music scene with modern clubwear",
    cta: "Shop London",
    link: "/shop",
    image: "/hero-london.jpg",
    culture: "london"
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { culture, setCulture, cultureInfo } = useThemeStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isPlaying) {
      interval = setInterval(() => {
        const nextSlide = (currentSlide + 1) % heroSlides.length;
        setCurrentSlide(nextSlide);
        // Apply theme when auto-changing slides if playing
        setCulture(heroSlides[nextSlide].culture as CultureTheme);
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentSlide, setCulture]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    // Automatically apply the theme when clicking on slide indicators
    setCulture(heroSlides[index].culture as CultureTheme);
  };

  const handleShopButtonClick = (slide: HeroSlide) => {
    // Navigate to shop with culture parameter
    const cultureName = slide.culture === 'newyork' ? 'New York' : 
                        slide.culture.charAt(0).toUpperCase() + slide.culture.slice(1);
    navigate(`/shop?culture=${cultureName}`);
  };

  return (
    <section className="relative h-[90vh] overflow-hidden bg-background">
      <AnimatePresence mode="wait">
        {heroSlides.map((slide, index) => (
          index === currentSlide && (
            <motion.div
              key={slide.id}
              className="absolute inset-0 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Static background - no auto animations */}
              <div className={`absolute inset-0 bg-gradient-to-br from-culture to-culture-accent/30 opacity-90 ${culture === slide.culture ? `culture-${slide.culture}` : ''}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-90" />
              
              {/* Music visualizer only visible when playing */}
              {isPlaying && (
                <div className="absolute bottom-0 left-0 right-0 h-16 flex justify-center items-end">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-1 mx-0.5 rounded-t-full bg-culture/40 backdrop-blur-sm`}
                      animate={{ 
                        height: [
                          Math.random() * 20 + 5,
                          Math.random() * 40 + 10, 
                          Math.random() * 20 + 5
                        ],
                      }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "reverse", 
                        duration: 0.8 + Math.random() * 0.5,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              )}
              
              <div className="container mx-auto px-4 z-10 mt-16">
                <div className="max-w-2xl">
                  <motion.div
                    className="flex items-center mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    <Music className="h-5 w-5 mr-2 text-culture animate-pulse" />
                    <span className="text-culture font-medium">
                      {cultureInfo[slide.culture as CultureTheme].musicGenre}
                    </span>
                  </motion.div>

                  <motion.h1
                    className="text-5xl md:text-7xl font-bold text-white mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    {slide.title}
                  </motion.h1>
                  
                  <motion.p
                    className="text-xl text-white/80 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {slide.subtitle}
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <Button 
                      className={`bg-culture text-culture-foreground hover:bg-culture/90`}
                      size="lg"
                      onClick={() => handleShopButtonClick(slide)}
                    >
                      {slide.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-2 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsPlaying(!isPlaying)}
          className="mr-2 bg-background/50 backdrop-blur-sm hover:bg-background/80"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        {heroSlides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => handleSlideChange(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide 
                ? "bg-culture w-8" 
                : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
