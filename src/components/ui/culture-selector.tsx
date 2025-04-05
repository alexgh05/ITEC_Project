import { motion } from 'framer-motion';
import { useThemeStore, CultureTheme } from '@/store/useThemeStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Music, Sparkles, Headphones, Building2, Palmtree, Heart, Radio } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAudio } from '@/providers/ThemeProvider';
import { getDynamicTranslation } from '@/lib/translations';

interface CultureOption {
  id: CultureTheme;
  name: {
    en: string;
    ro: string;
    es: string;
    de: string;
  };
  description: {
    en: string;
    ro: string;
    es: string;
    de: string;
  };
  image: string;
  icon: JSX.Element;
  musicText?: {
    en: string;
    ro: string;
    es: string;
    de: string;
  };
}

const CultureSelector = () => {
  const { culture, setCulture, cultureInfo, audioEnabled } = useThemeStore();
  const { language } = useLanguageStore();
  const { isPlaying, toggleAudio, audioRef } = useAudio();
  const [hoveredCulture, setHoveredCulture] = useState<CultureTheme | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [currentAutoIndex, setCurrentAutoIndex] = useState(0);

  // Debug logs
  console.log('CultureInfo:', cultureInfo);

  const cultureOptions: CultureOption[] = [
    {
      id: 'tokyo',
      name: {
        en: 'Tokyo',
        ro: 'Tokyo',
        es: 'Tokio',
        de: 'Tokio'
      },
      description: {
        en: 'Futuristic streetwear with neon aesthetics',
        ro: 'Îmbrăcăminte stradală futuristă cu estetică neon',
        es: 'Ropa urbana futurista con estética neón',
        de: 'Futuristische Streetwear mit Neon-Ästhetik'
      },
      image: '/culture-tokyo.jpg',
      icon: <Headphones className="h-4 w-4 text-white" />
    },
    {
      id: 'newyork',
      name: {
        en: 'New York',
        ro: 'New York',
        es: 'Nueva York',
        de: 'New York'
      },
      description: {
        en: 'Urban hip-hop inspired fashion',
        ro: 'Modă inspirată din hip-hop urban',
        es: 'Moda inspirada en el hip-hop urbano',
        de: 'Von urbanem Hip-Hop inspirierte Mode'
      },
      image: '/culture-newyork.jpg',
      icon: <Building2 className="h-4 w-4 text-white" />
    },
    {
      id: 'lagos',
      name: {
        en: 'Lagos',
        ro: 'Lagos',
        es: 'Lagos',
        de: 'Lagos'
      },
      description: {
        en: 'Vibrant Afrobeats culture with bold patterns',
        ro: 'Cultură vibrantă Afrobeats cu modele îndrăznețe',
        es: 'Cultura vibrante de Afrobeats con patrones audaces',
        de: 'Pulsierende Afrobeats-Kultur mit kühnen Mustern'
      },
      image: '/culture-lagos.jpg',
      icon: <Palmtree className="h-4 w-4 text-white" />
    },
    {
      id: 'seoul',
      name: {
        en: 'Seoul',
        ro: 'Seoul',
        es: 'Seúl',
        de: 'Seoul'
      },
      description: {
        en: 'K-pop influenced modern street style',
        ro: 'Stil stradal modern influențat de K-pop',
        es: 'Estilo urbano moderno influenciado por el K-pop',
        de: 'Von K-Pop beeinflusster moderner Streetstyle'
      },
      image: '/culture-seoul.jpg',
      icon: <Heart className="h-4 w-4 text-white" />
    },
    {
      id: 'london',
      name: {
        en: 'London',
        ro: 'Londra',
        es: 'Londres',
        de: 'London'
      },
      description: {
        en: 'Drill music scene with modern streetwear',
        ro: 'Scena muzicii Drill cu îmbrăcăminte stradală modernă',
        es: 'Escena musical Drill con ropa urbana moderna',
        de: 'Drill-Musikszene mit moderner Streetwear'
      },
      image: '/culture-london.jpg',
      icon: <Radio className="h-4 w-4 text-white" />
    },
    {
      id: 'berlin',
      name: {
        en: 'Berlin',
        ro: 'Berlin',
        es: 'Berlín',
        de: 'Berlin'
      },
      description: {
        en: 'Techno music scene with futuristic clubwear',
        ro: 'Scena muzicii techno cu îmbrăcăminte de club futuristă',
        es: 'Escena musical techno con ropa de club futurista',
        de: 'Techno-Musikszene mit futuristischer Clubkleidung'
      },
      image: 'none',
      icon: <Music className="h-4 w-4 text-white" />,
      musicText: {
        en: 'Electronic and Techno',
        ro: 'Electronic și Techno',
        es: 'Electrónica y Techno',
        de: 'Elektronik und Techno'
      }
    }
  ];

  // Filter options to only show cultures that exist in cultureInfo
  const availableCultureOptions = cultureOptions.filter(option => 
    cultureInfo && Object.keys(cultureInfo).includes(option.id)
  );
  
  // More debug logs
  console.log('Culture Options:', cultureOptions);
  console.log('Available Culture Options:', availableCultureOptions);
  console.log('Culture Info Keys:', cultureInfo ? Object.keys(cultureInfo) : 'No culture info');

  // Auto-rotate effect - starts the rotation after 10 seconds
  useEffect(() => {
    // Set a timeout to start the auto-rotate after 10 seconds
    const rotateTimer = setTimeout(() => {
      setAutoRotate(true);
    }, 10000);

    // Clear timeout if component unmounts
    return () => clearTimeout(rotateTimer);
  }, []);

  // Rotation logic - cycles through cultures automatically
  useEffect(() => {
    if (!autoRotate || availableCultureOptions.length === 0) return;

    // Set an interval to rotate every 3 seconds
    const interval = setInterval(() => {
      // Move to next culture, wrap around when reaching the end
      setCurrentAutoIndex(prevIndex => (prevIndex + 1) % availableCultureOptions.length);
    }, 3000);

    // Clear interval on unmount or if auto-rotate is disabled
    return () => clearInterval(interval);
  }, [autoRotate, availableCultureOptions.length]);

  // Effect to hover on the current culture when auto-rotating
  useEffect(() => {
    if (!autoRotate) return;
    if (availableCultureOptions.length > 0) {
      const currentOption = availableCultureOptions[currentAutoIndex];
      setHoveredCulture(currentOption.id);
    }
  }, [currentAutoIndex, autoRotate, availableCultureOptions]);

  // Stop auto-rotation when user interacts
  const handleUserInteraction = () => {
    setAutoRotate(false);
  };

  const handleCultureSelect = (newCulture: CultureTheme) => {
    // Stop auto-rotation when user selects a culture
    handleUserInteraction();
    
    console.log(`Culture selected: ${newCulture}`, {
      previous: culture,
      isPlaying,
      audioEnabled
    });
    
    // Special handling for Berlin
    if (newCulture === 'berlin') {
      console.log('Berlin special handling activated');
      
      // First apply the theme
      setCulture(newCulture);
      
      // Direct audio handling for Berlin
      try {
        // Stop the default audio first
        if (audioRef?.current && !audioRef.current.paused) {
          audioRef.current.pause();
        }
        
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
        
        // Reset the audio to start from the beginning
        berlinAudio.currentTime = 0;
        
        // Play the Berlin audio if global audio should be playing
        if (isPlaying) {
          console.log('Attempting to play Berlin audio');
          berlinAudio.play()
            .then(() => console.log('Berlin audio playing successfully'))
            .catch(err => {
              console.error('Error playing Berlin audio:', err);
              // Try the regular toggle as a fallback
              if (!isPlaying) {
                toggleAudio();
              }
            });
        }
      } catch (error) {
        console.error('Error with Berlin audio handling:', error);
        // Regular toggle as a fallback
        if (!isPlaying) {
          toggleAudio();
        }
      }
      
      return;
    }
    
    // For non-Berlin cultures, stop Berlin audio if it's playing
    const berlinAudio = document.getElementById('berlin-audio') as HTMLAudioElement;
    if (berlinAudio && !berlinAudio.paused) {
      berlinAudio.pause();
    }
    
    // For non-Berlin cultures, use the normal flow
    setCulture(newCulture);
    
    // Auto-play music if it's not already playing when selecting a non-default culture
    if (!isPlaying && newCulture !== 'default' && audioEnabled) {
      toggleAudio();
    }
  };

  // Helper function to get the localized music genre
  const getMusicGenre = (optionId: CultureTheme) => {
    const option = cultureOptions.find(opt => opt.id === optionId);
    
    if (option && option.musicText) {
      return getDynamicTranslation(option.musicText, language, option.musicText.en);
    }
    
    if (optionId === 'london') {
      return getDynamicTranslation({
        en: 'UK Drill & Rap',
        ro: 'UK Drill & Rap',
        es: 'UK Drill & Rap',
        de: 'UK Drill & Rap'
      }, language, 'UK Drill & Rap');
    }
    
    // Try to get from cultureInfo
    if (cultureInfo && cultureInfo[optionId] && cultureInfo[optionId].musicGenre) {
      return cultureInfo[optionId].musicGenre;
    }
    
    // Fallback
    return 'Music';
  };

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      onMouseEnter={handleUserInteraction}
    >
      {/* Combine available culture options and Berlin */}
      {[...availableCultureOptions, 
        // Only add Berlin manually if it's not already included
        ...(!availableCultureOptions.some(opt => opt.id === 'berlin') ? 
          [cultureOptions.find(opt => opt.id === 'berlin')] : 
          [])
      ].filter(Boolean).map((option) => (
        <motion.div
          key={option.id}
          className={`
            relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300
            ${culture === option.id ? 'ring-2 ring-culture shadow-lg' : 'hover:shadow-md hover:scale-105'}
          `}
          onClick={() => handleCultureSelect(option.id)}
          whileHover={{ scale: 1.03 }}
          onMouseEnter={() => setHoveredCulture(option.id)}
          onMouseLeave={() => autoRotate ? null : setHoveredCulture(null)}
        >
          {/* Background image */}
          <div 
            className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ${option.id === 'berlin' ? 'bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900' : ''}`}
            style={{ 
              backgroundImage: option.id === 'berlin' 
                ? 'none' 
                : `url(${option.image}), url('https://images.unsplash.com/photo-1599119357673-2c957228c88b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
              backgroundColor: option.id === 'berlin' ? 'transparent' : 'transparent',
              transform: hoveredCulture === option.id ? 'scale(1.1)' : 'scale(1)'
            }}
          />
          
          {/* Overlay gradient */}
          <div 
            className={`
              absolute inset-0 bg-gradient-to-t from-black/80 to-transparent 
              ${hoveredCulture === option.id ? 'opacity-80' : 'opacity-70'}
            `}
          />
          
          {/* Content */}
          <div className="relative p-4 h-40 flex flex-col justify-end">
            <div className="flex items-center mb-1">
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-culture/80 mr-2">
                {option.icon}
              </div>
              <h3 className="text-white font-medium">
                {typeof option.name === 'object' ? 
                  getDynamicTranslation(option.name, language, option.name.en) : 
                  option.name}
              </h3>
            </div>
            
            <p className="text-white/80 text-sm">
              {typeof option.description === 'object' ? 
                getDynamicTranslation(option.description, language, option.description.en) : 
                option.description}
            </p>
            
            {/* Music genre label */}
            <div className="mt-2 text-xs flex items-center text-white/70">
              <Music className="h-3 w-3 mr-1" />
              <span className="font-bold text-white">
                {getMusicGenre(option.id)}
              </span>
            </div>
          </div>
          
          {/* Selected indicator */}
          {culture === option.id && (
            <div
              className="absolute top-3 right-3 w-4 h-4 bg-culture rounded-full"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default CultureSelector;
