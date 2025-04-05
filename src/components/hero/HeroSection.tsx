import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Music, Volume2, VolumeX, Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore, CultureTheme } from '@/store/useThemeStore';
import { useAudio } from '@/providers/ThemeProvider';

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
    title: "London Drill",
    subtitle: "Drill music scene with modern streetwear",
    cta: "Shop London",
    link: "/shop",
    image: "/hero-london.jpg",
    culture: "london"
  },
  {
    id: 6,
    title: "Berlin Techno",
    subtitle: "Techno music scene with futuristic clubwear",
    cta: "Shop Berlin",
    link: "/shop",
    image: "/hero-berlin.jpg",
    culture: "berlin"
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { culture, setCulture, cultureInfo } = useThemeStore();
  const { isPlaying, isMuted, toggleAudio, toggleMute, audioRef } = useAudio();
  const navigate = useNavigate();
  const [autoSlideEnabled, setAutoSlideEnabled] = useState(true);
  
  // Control slideshow - only when auto-slide is enabled
  useEffect(() => {
    if (!autoSlideEnabled) return;
    
    // Auto-cycle slideshow
    const interval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % heroSlides.length;
      setCurrentSlide(nextSlide);
      // Apply theme when auto-changing slides
      setCulture(heroSlides[nextSlide].culture as CultureTheme);
    }, 10000);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentSlide, setCulture, autoSlideEnabled]);

  // New effect to handle Berlin audio when culture changes to Berlin
  useEffect(() => {
    // Helper function to manage Berlin audio
    const manageBerlinAudio = () => {
      try {
        // First, stop the default audio from ThemeProvider
        const defaultAudio = audioRef?.current;
        if (defaultAudio && !defaultAudio.paused) {
          defaultAudio.pause();
        }
        
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
        
        // Sync with global audio state
        berlinAudio.muted = isMuted;
        
        // Only play if global audio is playing
        if (isPlaying) {
          // Check if it's already playing to avoid restarting
          if (berlinAudio.paused) {
            berlinAudio.play()
              .then(() => console.log('Berlin audio playing from HeroSection'))
              .catch(err => console.error('Berlin audio play error in HeroSection:', err));
          }
        } else {
          // Make sure it's paused if global audio is paused
          berlinAudio.pause();
        }
      } catch (error) {
        console.error('Error handling Berlin audio in HeroSection:', error);
      }
    };
    
    // Handle based on current culture
    if (culture === 'berlin') {
      manageBerlinAudio();
    } else {
      // Stop Berlin audio when switching to other cultures
      const berlinAudio = document.getElementById('berlin-audio') as HTMLAudioElement;
      if (berlinAudio && !berlinAudio.paused) {
        berlinAudio.pause();
      }
      
      // Ensure default audio can play if it should be playing
      if (isPlaying && audioRef?.current?.paused) {
        audioRef.current.play()
          .catch(err => console.error('Error resuming default audio:', err));
      }
    }
  }, [culture, isPlaying, isMuted, audioRef]);

  const handleSlideChange = (index: number) => {
    // Disable auto-sliding when user manually selects a slide
    setAutoSlideEnabled(false);
    
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

  // Handle audio controls
  const handleToggleAudio = () => {
    // Special case for Berlin culture
    if (culture === 'berlin') {
      console.log('Hero section handling Berlin audio toggle');
      
      try {
        // Check if we already have a Berlin audio element
        let berlinAudio = document.getElementById('berlin-audio') as HTMLAudioElement;
        
        // If not, create one
        if (!berlinAudio) {
          berlinAudio = document.createElement('audio');
          berlinAudio.id = 'berlin-audio';
          berlinAudio.src = '/audio/berlin-techno.mp3';
          berlinAudio.volume = 0.3;
          berlinAudio.loop = true;
          document.body.appendChild(berlinAudio);
        }
        
        // First, ensure the default audio is paused
        if (audioRef?.current && !audioRef.current.paused) {
          audioRef.current.pause();
        }
        
        // Update global state first - this will affect visualizer display
        if (berlinAudio.paused) {
          // We're turning audio on
          toggleAudio(); // This will set isPlaying to true
          
          berlinAudio.play()
            .then(() => console.log('Berlin audio playing from toggle'))
            .catch(err => console.error('Berlin audio play error:', err));
        } else {
          // We're turning audio off  
          berlinAudio.pause();
          toggleAudio(); // This will set isPlaying to false
        }
      } catch (error) {
        console.error('Error handling Berlin audio in hero:', error);
        // Fallback to regular toggle
        toggleAudio();
      }
    } else {
      // For other cultures, ensure Berlin audio is stopped
      const berlinAudio = document.getElementById('berlin-audio') as HTMLAudioElement;
      if (berlinAudio && !berlinAudio.paused) {
        berlinAudio.pause();
      }
      
      // Regular toggle for other cultures
      toggleAudio();
    }
  };
  
  const handleToggleMute = () => {
    // Special case for Berlin audio
    if (culture === 'berlin') {
      const berlinAudio = document.getElementById('berlin-audio') as HTMLAudioElement;
      if (berlinAudio) {
        berlinAudio.muted = !isMuted;
      } 
      
      // Also mute default audio to be safe
      if (audioRef?.current) {
        audioRef.current.muted = !isMuted;
      }
      
      // Toggle global mute state
      toggleMute();
    } else {
      // For other cultures, also mute Berlin audio if it exists
      const berlinAudio = document.getElementById('berlin-audio') as HTMLAudioElement;
      if (berlinAudio) {
        berlinAudio.muted = !isMuted;
      }
      
      // Regular toggle for other cultures
      toggleMute();
    }
  };

  return (
    <section className="relative h-[90vh] overflow-hidden bg-background w-full">
      <AnimatePresence mode="wait">
        {heroSlides.map((slide, index) => (
          index === currentSlide && (
            <motion.div
              key={slide.id}
              className="absolute inset-0 flex items-center w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Static background - no auto animations */}
              <div className={`absolute inset-0 bg-gradient-to-br from-culture to-culture-accent/30 opacity-90 ${culture === slide.culture ? `culture-${slide.culture}` : ''}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-90" />
              
              {/* Music visualizer always visible when audio is playing */}
              {isPlaying && (
                <div className="absolute bottom-0 left-0 right-0 h-16 flex justify-center items-end">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-1 mx-0.5 rounded-t-full ${isMuted ? 'bg-culture/20' : 'bg-culture/40'} backdrop-blur-sm hidden sm:block`}
                      animate={{ 
                        height: isMuted 
                          ? 5 // Static small height when muted
                          : [
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
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-1 mx-0.5 rounded-t-full ${isMuted ? 'bg-culture/20' : 'bg-culture/40'} backdrop-blur-sm`}
                      animate={{ 
                        height: isMuted 
                          ? 5 // Static small height when muted
                          : [
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
              
              <div className="w-full container mx-auto px-4 sm:px-6 lg:px-8 z-10 mt-16 max-w-screen-2xl">
                <div className="max-w-2xl">
                  <motion.div
                    className="flex items-center mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    <Music className="h-5 w-5 mr-2 text-culture animate-pulse" />
                    <span className={`${slide.culture === 'berlin' ? 'text-muted-foreground' : 'text-culture font-medium'}`}>
                      {cultureInfo && cultureInfo[slide.culture as CultureTheme] 
                        ? slide.culture === 'london' 
                          ? 'Drill' 
                          : slide.culture === 'berlin'
                            ? 'Electronic and Techno'
                            : cultureInfo[slide.culture as CultureTheme].musicGenre
                        : 'Music'}
                    </span>
                  </motion.div>

                  <motion.h1
                    className="text-4xl md:text-7xl font-bold text-white mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    {slide.title}
                  </motion.h1>
                  
                  <motion.p
                    className="text-base md:text-xl text-white/80 mb-6 md:mb-8"
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

      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-2 z-20 w-full">
        {!isPlaying ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleAudio}
            className="mr-2 bg-background/50 backdrop-blur-sm hover:bg-background/80"
            title="Play music"
          >
            <Play className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleMute}
            className="mr-2 bg-background/50 backdrop-blur-sm hover:bg-background/80"
            title={isMuted ? "Unmute music" : "Mute music"}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        )}
        
        <div className="flex space-x-1 sm:space-x-2">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => handleSlideChange(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full transition-all ${
                index === currentSlide 
                  ? "bg-culture w-4 sm:w-8" 
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
