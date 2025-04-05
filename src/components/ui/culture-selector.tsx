import { motion } from 'framer-motion';
import { useThemeStore, CultureTheme } from '@/store/useThemeStore';
import { Music, Sparkles, Headphones, Building2, Palmtree, Heart, Radio } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAudio } from '@/providers/ThemeProvider';

interface CultureOption {
  id: CultureTheme;
  name: string;
  description: string;
  image: string;
  icon: JSX.Element;
}

const CultureSelector = () => {
  const { culture, setCulture, cultureInfo, audioEnabled } = useThemeStore();
  const { isPlaying, toggleAudio } = useAudio();
  const [hoveredCulture, setHoveredCulture] = useState<CultureTheme | null>(null);

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
      image: '/culture-berlin.jpg',
      icon: <Music className="h-4 w-4 text-white" />
    }
  ];

  const handleCultureSelect = (newCulture: CultureTheme) => {
    // Immediately apply the theme when clicked
    setCulture(newCulture);
    
    // Auto-play music if it's not already playing when selecting a non-default culture
    if (!isPlaying && newCulture !== 'default' && audioEnabled) {
      toggleAudio();
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cultureOptions.map((option) => (
        <motion.div
          key={option.id}
          className={`
            relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300
            ${culture === option.id ? 'ring-2 ring-culture shadow-lg' : 'hover:shadow-md hover:scale-105'}
          `}
          onClick={() => handleCultureSelect(option.id)}
          whileHover={{ scale: 1.03 }}
          onMouseEnter={() => setHoveredCulture(option.id)}
          onMouseLeave={() => setHoveredCulture(null)}
        >
          {/* Background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
            style={{ 
              backgroundImage: `url(${option.image})`,
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
              {cultureInfo[option.id].musicGenre}
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
