import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Heart, Building2, Sparkles, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/useThemeStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AudioBeatVisualizer } from '@/components/ui/audio-beat-visualizer';
import { OutfitCard } from '@/components/outfit/OutfitCard';
import { useAudio } from '@/providers/ThemeProvider';

export const OutfitGenerator = () => {
  const { culture, setCulture, cultureInfo, darkMode, toggleDarkMode } = useThemeStore();
  const { isPlaying, toggleAudio } = useAudio();
  const [musicGenre, setMusicGenre] = useState<string>('trap');
  const [emotionalState, setEmotionalState] = useState<string>('energetic');
  const [city, setCity] = useState<string>('tokyo');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutfit, setGeneratedOutfit] = useState<OutfitResult | null>(null);
  const [clickAttempts, setClickAttempts] = useState(0);
  const [debugMessage, setDebugMessage] = useState<string>('');
  const nativeButtonRef = useRef<HTMLButtonElement>(null);
  
  // Direct state manipulation function (emergency backup)
  const directUpdateState = () => {
    console.clear();
    console.log('Direct state update triggered');
    setDebugMessage('Direct state update triggered');
    setClickAttempts(prev => prev + 1);
    
    // Create a sample outfit with a separate object to avoid any reference issues
    const outfitResult = {
      name: 'Emergency Generated Outfit',
      description: 'This outfit was generated through direct state manipulation, bypassing the normal generation process.',
      colorPalette: ['#FF2E7E', '#3649FF', '#00F0FF', '#111111'],
      dominantColor: '#FF2E7E',
      musicGenre: musicGenre,
      city: city,
      emotionalState: emotionalState,
      imageUrl: `/outfits/${city}-${musicGenre}.png`,
      storeProducts: true
    };
    
    // Force render by ensuring state updates are applied
    setIsGenerating(false);
    setTimeout(() => {
      console.log('Setting generatedOutfit directly');
      setGeneratedOutfit(outfitResult);
      
      // Force a re-render by updating an unrelated state
      setDebugMessage('Generated via emergency method');
    }, 100);
    
    // Try to trigger audio if needed
    try {
      if (!isPlaying) {
        toggleAudio();
      }
    } catch (e) {
      console.error('Audio toggle error:', e);
    }
  };
  
  // Prevent form submission and refresh
  const handleButtonClick = (action: () => void) => (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.target instanceof HTMLElement) {
      // Prevent any parent form submission
      let parent = event.target.parentElement;
      while (parent) {
        if (parent instanceof HTMLFormElement) {
          event.preventDefault();
          break;
        }
        parent = parent.parentElement;
      }
    }
    action();
  };
  
  // Simulated data for the UI demo
  const musicGenres = [
    { value: 'trap', label: 'Trap' },
    { value: 'hiphop', label: 'Hip Hop' },
    { value: 'techno', label: 'Techno' },
    { value: 'drill', label: 'Drill' },
    { value: 'kpop', label: 'K-Pop' },
    { value: 'afrobeats', label: 'Afrobeats' }
  ];
  
  const emotionalStates = [
    { value: 'energetic', label: 'Energetic' },
    { value: 'confident', label: 'Confident' },
    { value: 'rebellious', label: 'Rebellious' },
    { value: 'mysterious', label: 'Mysterious' }
  ];
  
  const cities = [
    { value: 'tokyo', label: 'Tokyo' },
    { value: 'newyork', label: 'New York' },
    { value: 'london', label: 'London' },
    { value: 'seoul', label: 'Seoul' },
    { value: 'lagos', label: 'Lagos' },
    { value: 'berlin', label: 'Berlin' }
  ];
  
  // Filter cities to only show those that exist in cultureInfo
  const availableCities = cities.filter(cityOption => 
    cultureInfo && Object.keys(cultureInfo).includes(cityOption.value)
  );
  
  // When a city is selected, update the culture theme to match if available
  useEffect(() => {
    const cityCultureMap: Record<string, any> = {
      'tokyo': 'tokyo',
      'newyork': 'newyork',
      'london': 'london',
      'seoul': 'seoul',
      'lagos': 'lagos',
      'berlin': 'berlin'
    };
    
    if (cityCultureMap[city] && cityCultureMap[city] !== culture) {
      setCulture(cityCultureMap[city]);
    }
  }, [city, culture, setCulture]);
  
  // Add global click handler for debugging
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setDebugMessage(`Clicked: ${target.tagName} (${target.className.slice(0, 20)}...)`);
      console.log('Click detected on:', target);
    };
    
    document.addEventListener('click', handleGlobalClick);
    
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);
  
  // Add direct event handler to the native button
  useEffect(() => {
    const buttonEl = nativeButtonRef.current;
    if (buttonEl) {
      const handleDirectClick = () => {
        console.log('Direct click handler fired');
        setDebugMessage('Direct click handler fired');
        generateOutfit();
      };
      
      buttonEl.addEventListener('click', handleDirectClick);
      return () => {
        buttonEl.removeEventListener('click', handleDirectClick);
      };
    }
  }, []);
  
  // Add effect to monitor isGenerating state changes
  useEffect(() => {
    console.log('isGenerating state changed:', isGenerating);
  }, [isGenerating]);
  
  // Generate outfit function
  const generateOutfit = () => {
    try {
      console.clear(); // Clear previous logs
      console.log('generateOutfit function called');
      setDebugMessage(`Generating outfit (attempt: ${clickAttempts + 1})`);
      setClickAttempts(prev => prev + 1);
      setIsGenerating(true);
      
      // Simulate API call with a timeout - shorter timeout for testing
      setTimeout(() => {
        try {
          console.log('Timeout callback executing');
          // Example outfit generation based on inputs
          const colorPalettes: Record<string, string[]> = {
            'tokyo': ['#FF2E7E', '#3649FF', '#00F0FF', '#111111'],
            'newyork': ['#232528', '#2C55A2', '#D64045', '#F9F9F9'],
            'london': ['#5863F8', '#0E2535', '#EAF205', '#B8EBD0'],
            'seoul': ['#FFB8DE', '#A5AAF2', '#FFF07A', '#121212'],
            'lagos': ['#FFB400', '#3F173F', '#29A0B1', '#E5DDDB'],
            'berlin': ['#9932CC', '#8A2BE2', '#4B0082', '#191919']
          };
          
          const outfitNames: Record<string, string[]> = {
            'trap': ['Neon Ronin', 'Street Prophet', 'Urban Samurai', 'Chrome Bandit'],
            'hiphop': ['Flow Master', 'Concrete Poet', 'Rhythm Rebel', 'Lyrical Ghost'],
            'techno': ['Digital Nomad', 'Cyber Pulse', 'Quantum Drift', 'Electric Horizon'],
            'drill': ['Shadow Crew', 'Dark Streets', 'Urban Knight', 'Night Runner'],
            'kpop': ['Pastel Dream', 'Neon Daydream', 'Soft Focus', 'Candy Floss Warrior'],
            'afrobeats': ['Rhythm King', 'Lagos Nights', 'Vibrant Pulse', 'Golden Flow']
          };
          
          // Generate a random outfit name based on genre
          const outfitNamesForGenre = outfitNames[musicGenre] || outfitNames.trap;
          const randomName = outfitNamesForGenre[Math.floor(Math.random() * outfitNamesForGenre.length)];
          
          // Get color palette for the city
          const colors = colorPalettes[city] || colorPalettes.tokyo;
          
          // Create outfit description based on inputs
          let outfitDescription = `A personalized outfit curated from our in-store products that captures the essence of ${city}'s ${musicGenre} scene. This ${emotionalState} look uses actual items from our store's collection.`;
          
          // Add a note about store products
          outfitDescription += "\n\nAll items shown are available in our store and can be purchased individually or as a complete look with a special discount.";
          
          const result: OutfitResult = {
            name: randomName,
            description: outfitDescription,
            colorPalette: colors,
            dominantColor: colors[0],
            musicGenre: musicGenre,
            city: city,
            emotionalState: emotionalState,
            imageUrl: `/outfits/${city}-${musicGenre}.png`, // This would be a generated image in a real app
            // Remove specific outfit elements since we'll use actual store products
            storeProducts: true
          };
          
          // Log before state update
          console.log('About to set isGenerating to false and update outfit result');
          setGeneratedOutfit(result);
          setIsGenerating(false);
          setDebugMessage(`Generated outfit successfully (${result.name})`);
          
          // Make sure audio is playing for immersive experience
          if (!isPlaying) {
            toggleAudio();
          }
        } catch (error) {
          console.error('Error generating outfit:', error);
          setDebugMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
          setIsGenerating(false);
        }
      }, 1500); // Shortened to 1.5 seconds for testing
    } catch (e) {
      console.error('Error in generateOutfit function:', e);
      setDebugMessage(`Error in generateOutfit: ${e instanceof Error ? e.message : String(e)}`);
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="min-h-screen w-full">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-0" />
      
      {/* Fixed top emergency button */}
      <div className="fixed top-20 right-4 z-[9999] shadow-xl flex flex-col gap-3">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            directUpdateState();
          }}
          className="animate-pulse px-4 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-md shadow-lg border-2 border-yellow-300"
        >
          <span className="flex items-center">
            <Sparkles className={`mr-2 h-5 w-5 ${darkMode ? 'text-yellow-400' : 'text-indigo-600'}`} />
            Emergency Generate
          </span>
        </button>
        
        {/* Dark/Light Mode Toggle */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleDarkMode();
          }}
          className={`px-4 py-3 ${darkMode ? 'bg-black/50 hover:bg-black/70 text-white' : 'bg-white/90 hover:bg-white text-gray-800'} font-bold rounded-md shadow-lg border ${darkMode ? 'border-culture/30' : 'border-gray-300'}`}
        >
          <span className="flex items-center">
            {darkMode ? (
              <>
                <Sun className="mr-2 h-5 w-5 text-yellow-400" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="mr-2 h-5 w-5 text-blue-400" />
                Dark Mode
              </>
            )}
          </span>
        </button>
      </div>
      
      {/* Dynamic background effect */}
      <div 
        className="fixed inset-0 bg-gradient-to-br from-transparent to-culture/30 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, 
            rgba(var(--culture-rgb), 0.3) 0%, 
            rgba(var(--culture-rgb), 0.1) 40%, 
            transparent 70%)`,
          backgroundColor: darkMode 
            ? `rgba(0, 0, 0, 0.8)` 
            : culture && cultureInfo && cultureInfo[culture]
              ? `rgba(${cultureInfo[culture].rgbColor || '0, 0, 0'}, 0.2)`
              : `rgba(${
                city === 'tokyo' ? '20, 10, 40, 0.3' :
                city === 'newyork' ? '35, 42, 50, 0.3' :
                city === 'london' ? '44, 62, 80, 0.3' :
                city === 'seoul' ? '89, 65, 169, 0.3' :
                city === 'lagos' ? '255, 180, 0, 0.2' :
                city === 'berlin' ? '50, 23, 77, 0.3' : '0, 0, 0, 0.2'
              })`,
          backgroundBlendMode: 'overlay',
          transition: 'background-color 0.5s ease-in-out'
        }}
      />
      
      {/* Content container */}
      <div className="container relative z-10 py-12 px-4 md:px-8 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className={`text-4xl md:text-6xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} tracking-tight mb-4`}>
            <span className={darkMode ? "text-culture" : "text-indigo-600"}>AI</span> Outfit Generator
            <span className="inline-block ml-3">
              {darkMode ? (
                <Moon className="inline-block w-8 h-8 text-blue-400 opacity-80" />
              ) : (
                <Sun className="inline-block w-8 h-8 text-yellow-500 opacity-90" />
              )}
            </span>
          </h1>
          <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'} text-lg max-w-3xl mx-auto`}>
            Create a unique fashion identity based on your preferences
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 z-10">
          <Card 
            className={`p-6 ${
              darkMode 
                ? 'border-white/5 bg-black/30' 
                : 'border-gray-200 bg-white/95'
            } backdrop-blur-lg overflow-hidden`}
          >
            <div className="space-y-6">
              <div className="flex items-center">
                <Sparkles className={`w-5 h-5 mr-2 ${darkMode ? 'text-culture' : 'text-indigo-600'}`} />
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Design Your Style</h2>
              </div>
              
              <div className="space-y-4">
                {/* Music Genre */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Music className={`w-4 h-4 ${darkMode ? 'text-culture' : 'text-indigo-600'}`} />
                    <label htmlFor="musicGenre" className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Music Genre
                    </label>
                  </div>
                  <Select value={musicGenre} onValueChange={setMusicGenre}>
                    <SelectTrigger 
                      id="musicGenre" 
                      className={`w-full ${
                        darkMode 
                          ? 'border-white/10 bg-white/5 text-white' 
                          : 'border-gray-200 bg-white text-gray-900'
                      }`}
                    >
                      <SelectValue placeholder="Select music genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {musicGenres.map((genre) => (
                        <SelectItem key={genre.value} value={genre.value}>
                          {genre.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Emotional State */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Heart className={`w-4 h-4 ${darkMode ? 'text-culture' : 'text-indigo-600'}`} />
                    <label htmlFor="emotionalState" className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Emotional State
                    </label>
                  </div>
                  <Select value={emotionalState} onValueChange={setEmotionalState}>
                    <SelectTrigger 
                      id="emotionalState" 
                      className={`w-full ${
                        darkMode 
                          ? 'border-white/10 bg-white/5 text-white' 
                          : 'border-gray-200 bg-white text-gray-900'
                      }`}
                    >
                      <SelectValue placeholder="Select emotional state" />
                    </SelectTrigger>
                    <SelectContent>
                      {emotionalStates.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* City Influence */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Building2 className={`w-4 h-4 ${darkMode ? 'text-culture' : 'text-indigo-600'}`} />
                    <label htmlFor="city" className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      City Influence
                    </label>
                  </div>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger 
                      id="city" 
                      className={`w-full ${
                        darkMode 
                          ? 'border-white/10 bg-white/5 text-white' 
                          : 'border-gray-200 bg-white text-gray-900'
                      }`}
                    >
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCities.map((cityOption) => (
                        <SelectItem key={cityOption.value} value={cityOption.value}>
                          {cityOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* This is the main button */}
                <div className="pt-2">
                  <Button
                    ref={nativeButtonRef}
                    className={`w-full h-12 ${
                      darkMode 
                        ? 'bg-culture hover:bg-culture/90 text-white' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                    onClick={handleButtonClick(generateOutfit)}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Generating...
                      </div>
                    ) : (
                      'Generate Outfit'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Results section */}
          <div className="relative z-20">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {!generatedOutfit ? (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex items-center justify-center"
                  >
                    <div className={`p-8 rounded-lg ${darkMode ? 'bg-black/30' : 'bg-white/95'} backdrop-blur-md border ${darkMode ? 'border-white/10' : 'border-gray-200'} text-center shadow-md`}>
                      <div className={`w-24 h-24 rounded-full ${darkMode ? 'bg-culture/20' : 'bg-indigo-100'} mx-auto flex items-center justify-center mb-4`}>
                        <Sparkles className={`w-10 h-10 ${darkMode ? 'text-culture' : 'text-indigo-600'}`} />
                      </div>
                      <h3 className={`text-xl font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Your Fashion Identity</h3>
                      <p className={`${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                        Generate your unique outfit to see your personalized fashion identity
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                  >
                    <OutfitCard outfit={generatedOutfit} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Loading Overlay */}
      {isGenerating && (
        <div className={`fixed inset-0 ${darkMode ? 'bg-black/50' : 'bg-white/60'} backdrop-blur-sm z-50 flex items-center justify-center`}>
          <div className={`${darkMode ? 'bg-black/80' : 'bg-white/90'} p-8 rounded-xl border ${darkMode ? 'border-culture/30' : 'border-gray-300'} flex flex-col items-center`}>
            <div className="w-20 h-20 border-4 border-culture border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className={`${darkMode ? 'text-white' : 'text-gray-900'} text-xl font-medium`}>Generating your outfit...</div>
            <div className={`${darkMode ? 'text-white/60' : 'text-gray-600'} mt-2`}>This will take just a moment</div>
          </div>
        </div>
      )}
      
      {/* Debug info */}
      {(debugMessage || clickAttempts > 0) && (
        <div className="fixed bottom-4 left-4 right-4 bg-black/80 text-white p-4 rounded-md z-50 text-sm">
          <div>Debug: {debugMessage || 'No message'}</div>
          <div>Click attempts: {clickAttempts}</div>
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => {
                console.log('Reset debug clicked');
                setClickAttempts(0);
                setDebugMessage('Debug info reset');
              }}
              className="px-2 py-1 bg-red-600 text-white text-xs rounded"
            >
              Reset Debug
            </button>
            
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                directUpdateState();
              }}
              className="px-4 py-2 bg-yellow-500 text-black font-bold text-sm rounded-md shadow-lg border-2 border-yellow-300"
            >
              EMERGENCY GENERATE (Click This!)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Type definition for the generated outfit
interface OutfitResult {
  name: string;
  description: string;
  colorPalette: string[];
  dominantColor: string;
  musicGenre: string;
  city: string;
  emotionalState: string;
  imageUrl: string;
  outfitElements?: {
    hat: string;
    tShirt: string;
    pants: string;
    accessory: string;
  };
  musicRecommendation?: string;
  storeProducts?: boolean;
}

export default OutfitGenerator; 