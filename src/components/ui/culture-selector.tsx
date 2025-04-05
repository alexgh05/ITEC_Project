import { motion } from 'framer-motion';
import { useThemeStore, CultureTheme } from '@/store/useThemeStore';
import { Music, Sparkles, Headphones, Building2, Palmtree, Heart, Radio } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAudio } from '@/providers/ThemeProvider';

interface CultureOption {
  id: CultureTheme;
  name: string;
  description: string;
  image: string;
  icon: JSX.Element;
  musicText?: string;
}

const CultureSelector = () => {
  const { culture, setCulture, cultureInfo, audioEnabled } = useThemeStore();
  const { isPlaying, toggleAudio } = useAudio();
  const [hoveredCulture, setHoveredCulture] = useState<CultureTheme | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [currentAutoIndex, setCurrentAutoIndex] = useState(0);

  // Debug logs
  console.log('CultureInfo:', cultureInfo);

  const cultureOptions: CultureOption[] = [
    {
      id: 'tokyo',
      name: 'Tokyo',
      description: 'Futuristic streetwear with neon aesthetics',
      image: '/culture-tokyo.jpg',
      icon: <Headphones className="h-4 w-4 text-white" />
    },
    {
      id: 'newyork',
      name: 'New York',
      description: 'Urban hip-hop inspired fashion',
      image: '/culture-newyork.jpg',
      icon: <Building2 className="h-4 w-4 text-white" />
    },
    {
      id: 'lagos',
      name: 'Lagos',
      description: 'Vibrant Afrobeats culture with bold patterns',
      image: '/culture-lagos.jpg',
      icon: <Palmtree className="h-4 w-4 text-white" />
    },
    {
      id: 'seoul',
      name: 'Seoul',
      description: 'K-pop influenced modern street style',
      image: '/culture-seoul.jpg',
      icon: <Heart className="h-4 w-4 text-white" />
    },
    {
      id: 'london',
      name: 'London',
      description: 'Drill music scene with modern streetwear',
      image: '/culture-london.jpg',
      icon: <Radio className="h-4 w-4 text-white" />
    },
    {
      id: 'berlin',
      name: 'Berlin',
      description: 'Techno music scene with futuristic clubwear',
      image: 'none',
      icon: <Music className="h-4 w-4 text-white" />,
      musicText: 'Electronic and Techno'
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
    
    // Immediately apply the theme when clicked
    setCulture(newCulture);
    
    // Auto-play music if it's not already playing when selecting a non-default culture
    if (!isPlaying && newCulture !== 'default' && audioEnabled) {
      toggleAudio();
    }
  };

  return (
    <div 
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
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
              <h3 className="text-white font-medium">{option.name}</h3>
            </div>
            
            <p className="text-white/80 text-sm">
              {option.description}
            </p>
            
            {/* Music genre label */}
            <div className="mt-2 text-xs flex items-center text-white/70">
              <Music className="h-3 w-3 mr-1" />
              <span className="font-bold text-white">
                {option.id === 'berlin' ? 
                  'Electronic and Techno' :
                  option.id === 'london' ? 
                    'UK Drill & Rap' : 
                    (cultureInfo && cultureInfo[option.id] ? 
                      cultureInfo[option.id].musicGenre : 'Music')
                }
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
