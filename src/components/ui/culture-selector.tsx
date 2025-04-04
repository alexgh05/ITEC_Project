import { motion } from 'framer-motion';
import { useThemeStore, CultureTheme } from '@/store/useThemeStore';
import { Music, Sparkles, Headphones, Building2, Palmtree, Heart, Radio } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CultureOption {
  id: CultureTheme;
  name: string;
  description: string;
  image: string;
  icon: JSX.Element;
}

const CultureSelector = () => {
  const { culture, setCulture, cultureInfo, audioEnabled, toggleAudio } = useThemeStore();
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
      description: 'Electronic music scene with modern clubwear',
      image: '/culture-london.jpg',
      icon: <Radio className="h-4 w-4 text-white" />
    }
  ];

  const handleCultureSelect = (newCulture: CultureTheme) => {
    // Immediately apply the theme when clicked
    setCulture(newCulture);
    if (!audioEnabled && newCulture !== 'default') {
      toggleAudio();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cultureOptions.map((option) => (
        <motion.div
          key={option.id}
          whileHover={{ y: -5, scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onHoverStart={() => setHoveredCulture(option.id)}
          onHoverEnd={() => setHoveredCulture(null)}
          className={`relative cursor-pointer rounded-lg overflow-hidden group ${
            culture === option.id ? 'ring-2 ring-culture' : ''
          }`}
          onClick={() => handleCultureSelect(option.id)}
        >
          <div className="aspect-square bg-muted relative overflow-hidden">
            <div 
              className={`absolute inset-0 bg-gradient-to-br from-culture to-culture-accent/50 opacity-80 culture-${option.id}`}
            />
            
            {option.id === 'tokyo' && hoveredCulture === 'tokyo' && (
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-30">
                {[...Array(12)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="border border-pink-300/30"
                    animate={{
                      opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                      duration: 1.5 + i * 0.2,
                      repeat: Infinity,
                      delay: i * 0.1
                    }}
                  />
                ))}
              </div>
            )}
            
            {option.id === 'newyork' && hoveredCulture === 'newyork' && (
              <div className="absolute inset-0 flex flex-col justify-end opacity-30">
                {[...Array(6)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="h-8 bg-gray-800 mx-1 rounded-t"
                    style={{ 
                      height: `${20 + i * 15}px`, 
                      width: `${15 + Math.random() * 20}px`,
                      marginLeft: `${5 + i * 20}px`
                    }}
                  />
                ))}
              </div>
            )}
            
            {option.id === 'lagos' && hoveredCulture === 'lagos' && (
              <div className="absolute inset-0 overflow-hidden opacity-30">
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-24 bg-blue-400"
                  animate={{
                    y: [0, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                <div className="absolute bottom-20 left-10">
                  <motion.div 
                    className="w-16 h-20 bg-green-600 rounded-t-full"
                    animate={{
                      rotate: [0, 5, 0, -5, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                  />
                </div>
              </div>
            )}
            
            {option.id === 'seoul' && hoveredCulture === 'seoul' && (
              <div className="absolute inset-0 opacity-30">
                {[...Array(8)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="absolute"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                      duration: 1 + Math.random() * 2,
                      repeat: Infinity,
                    }}
                  >
                    <Heart 
                      className="text-pink-300" 
                      size={10 + Math.random() * 10}
                      fill="currentColor"
                    />
                  </motion.div>
                ))}
              </div>
            )}
            
            {option.id === 'london' && hoveredCulture === 'london' && (
              <div className="absolute inset-0 opacity-30">
                {/* LED grid pattern */}
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1">
                  {[...Array(16)].map((_, i) => (
                    <motion.div 
                      key={i}
                      className="bg-blue-400/50 rounded-sm"
                      style={{
                        gridColumn: `${(i % 4) + 1} / span 1`,
                        gridRow: `${Math.floor(i / 4) + 1} / span 1`
                      }}
                      animate={{
                        opacity: [0.2, 0.8, 0.2],
                        backgroundColor: ['rgba(59, 130, 246, 0.5)', 'rgba(147, 51, 234, 0.5)', 'rgba(59, 130, 246, 0.5)']
                      }}
                      transition={{
                        duration: 2 + i * 0.2,
                        repeat: Infinity,
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </div>
                
                {/* Sound wave visualizer effect */}
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center h-1/2">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 mx-0.5 rounded-t-sm bg-blue-400"
                      style={{ height: 4 }}
                      animate={{
                        height: [
                          5 + Math.random() * 10,
                          15 + Math.random() * 20,
                          5 + Math.random() * 10
                        ]
                      }}
                      transition={{
                        duration: 0.5 + Math.random() * 0.5,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div 
              className="absolute top-3 left-3 p-2 rounded-full bg-black/20 backdrop-blur-sm"
            >
              {option.icon}
            </div>
            
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <h3 className="text-xl font-bold text-white flex items-center">
                {option.name}
                {culture === option.id && (
                  <span className="ml-2 inline-flex">
                    <Sparkles className="h-4 w-4 text-white/80" />
                  </span>
                )}
              </h3>
              <p className="text-white/80">{option.description}</p>
              <p className="text-xs text-white/70 mt-2 font-medium">
                {cultureInfo[option.id].musicGenre}
              </p>
              
              {culture === option.id && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-white"
                />
              )}
            </div>
          </div>
          
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
