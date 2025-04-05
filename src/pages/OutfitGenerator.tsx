import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Heart, Building2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/useThemeStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AudioBeatVisualizer } from '@/components/ui/audio-beat-visualizer';
import { OutfitCard } from '@/components/outfit/OutfitCard';
import { useAudio } from '@/providers/ThemeProvider';

export const OutfitGenerator = () => {
  const { culture, setCulture, cultureInfo } = useThemeStore();
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
      imageUrl: `/outfits/${city}-${musicGenre}.png`
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
    { value: 'jazz', label: 'Jazz' },
    { value: 'techno', label: 'Techno' },
    { value: 'hiphop', label: 'Hip Hop' },
    { value: 'pop', label: 'Pop' },
    { value: 'rock', label: 'Rock' },
    { value: 'latin', label: 'Latin' },
    { value: 'kpop', label: 'K-Pop' },
  ];
  
  const emotionalStates = [
    { value: 'energetic', label: 'Energetic' },
    { value: 'nostalgic', label: 'Nostalgic' },
    { value: 'rebellious', label: 'Rebellious' },
    { value: 'romantic', label: 'Romantic' },
    { value: 'melancholic', label: 'Melancholic' },
    { value: 'joyful', label: 'Joyful' },
    { value: 'confident', label: 'Confident' },
    { value: 'mysterious', label: 'Mysterious' },
  ];
  
  const cities = [
    { value: 'tokyo', label: 'Tokyo' },
    { value: 'paris', label: 'Paris' },
    { value: 'newyork', label: 'New York' },
    { value: 'london', label: 'London' },
    { value: 'seoul', label: 'Seoul' },
    { value: 'lagos', label: 'Lagos' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'rio', label: 'Rio de Janeiro' },
  ];
  
  // When a city is selected, update the culture theme to match if available
  useEffect(() => {
    const cityCultureMap: Record<string, any> = {
      'tokyo': 'tokyo',
      'newyork': 'newyork',
      'london': 'london',
      'seoul': 'seoul',
      'lagos': 'lagos',
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
            'paris': ['#F5D6C6', '#3A3042', '#EF9D87', '#4F5165'],
            'newyork': ['#232528', '#2C55A2', '#D64045', '#F9F9F9'],
            'london': ['#5863F8', '#0E2535', '#EAF205', '#B8EBD0'],
            'seoul': ['#FFB8DE', '#A5AAF2', '#FFF07A', '#121212'],
            'lagos': ['#FFB400', '#3F173F', '#29A0B1', '#E5DDDB'],
            'mumbai': ['#FF7400', '#FFDB58', '#7851A9', '#00539C'],
            'rio': ['#97C93D', '#FCDB00', '#7CBBDE', '#F3752B'],
          };
          
          const outfitNames: Record<string, string[]> = {
            'trap': ['Neon Ronin', 'Street Prophet', 'Urban Samurai', 'Chrome Bandit'],
            'jazz': ['Velvet Noir', 'Midnight Serenade', 'Blue Note Dreamer', 'Smooth Operator'],
            'techno': ['Digital Nomad', 'Cyber Pulse', 'Quantum Drift', 'Electric Horizon'],
            'hiphop': ['Flow Master', 'Concrete Poet', 'Rhythm Rebel', 'Lyrical Ghost'],
            'pop': ['Candy Haze', 'Prism Wave', 'Sparkle Shift', 'Bubblegum Halo'],
            'rock': ['Vintage Vortex', 'Leather Legend', 'Riff Runner', 'Shadow Stance'],
            'latin': ['Tropical Pulse', 'Salsa Sunset', 'Vibrant Rhythm', 'Spice Wave'],
            'kpop': ['Pastel Dream', 'Neon Daydream', 'Soft Focus', 'Candy Floss Warrior'],
          };
          
          // Generate a random outfit name based on genre
          const outfitNamesForGenre = outfitNames[musicGenre] || outfitNames.trap;
          const randomName = outfitNamesForGenre[Math.floor(Math.random() * outfitNamesForGenre.length)];
          
          // Get color palette for the city
          const colors = colorPalettes[city] || colorPalettes.tokyo;
          
          // Create outfit description based on inputs
          let outfitDescription = '';
          
          if (city === 'tokyo' && musicGenre === 'trap' && emotionalState === 'energetic') {
            outfitDescription = 'A futuristic cyberpunk ensemble featuring a holographic windbreaker with reflective panels, fitted cargo pants with multiple utility pockets, chunky platform sneakers with LED accents, and tech-inspired accessories. Completed with a sleek crossbody bag and fingerless gloves.';
          } else if (city === 'paris' && musicGenre === 'jazz' && emotionalState === 'nostalgic') {
            outfitDescription = 'A sophisticated vintage-inspired look with a modern twist. Flowing high-waisted trousers paired with a silk blouse, oversized blazer with subtle patterns, and classic leather oxfords. Accessorized with minimal gold jewelry and a beret for timeless Parisian elegance.';
          } else {
            outfitDescription = `A unique blend of ${city}'s cultural aesthetic and ${musicGenre} influences, expressing a ${emotionalState} mood. The outfit features distinctive silhouettes, bold textural elements, and culturally-inspired details that create a striking visual statement.`;
          }
          
          const result: OutfitResult = {
            name: randomName,
            description: outfitDescription,
            colorPalette: colors,
            dominantColor: colors[0],
            musicGenre: musicGenre,
            city: city,
            emotionalState: emotionalState,
            imageUrl: `/outfits/${city}-${musicGenre}.png` // This would be a generated image in a real app
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
      setDebugMessage(`Top-level error: ${e instanceof Error ? e.message : String(e)}`);
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="min-h-screen w-full">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-0" />
      
      {/* Fixed top emergency button */}
      <div className="fixed top-20 right-4 z-[9999] shadow-xl">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            directUpdateState();
          }}
          className="animate-pulse px-4 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-md shadow-lg border-2 border-yellow-300"
        >
          <span className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5" />
            Emergency Generate
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
            transparent 70%)`
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
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">
            <span className="text-culture">AI</span> Outfit Generator
          </h1>
          <p className="text-white/70 text-lg max-w-3xl mx-auto">
            Create your unique fashion identity with our premium AI stylist. Generate outfits influenced by music genres, emotions, and cities around the world.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Input section */}
          <div className="relative z-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6 bg-black/40 backdrop-blur-lg border-culture/20 overflow-hidden relative">
                <div className="absolute inset-0 opacity-10 overflow-hidden pointer-events-none">
                  <AudioBeatVisualizer
                    className="h-full w-full"
                    barCount={40}
                    barWidth={2}
                    direction="horizontal"
                    sensitivity={1.2}
                    minHeight={2}
                    maxHeight={100}
                    rounded={false}
                  />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-culture" />
                  Design Your Style
                </h2>
                
                <div className="space-y-6" onSubmit={(e) => { e.preventDefault(); console.log('Form submitted, preventing default'); }}>
                  <div className="space-y-2">
                    <label className="text-white/80 flex items-center text-sm font-medium">
                      <Music className="w-4 h-4 mr-2 text-culture/80" />
                      Music Genre
                    </label>
                    <Select value={musicGenre} onValueChange={setMusicGenre}>
                      <SelectTrigger className="w-full bg-black/50 border-culture/30 text-white">
                        <SelectValue placeholder="Select a music genre" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-culture/20 text-white">
                        {musicGenres.map((genre) => (
                          <SelectItem key={genre.value} value={genre.value}>
                            {genre.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-white/80 flex items-center text-sm font-medium">
                      <Heart className="w-4 h-4 mr-2 text-culture/80" />
                      Emotional State
                    </label>
                    <Select value={emotionalState} onValueChange={setEmotionalState}>
                      <SelectTrigger className="w-full bg-black/50 border-culture/30 text-white">
                        <SelectValue placeholder="Select an emotional state" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-culture/20 text-white">
                        {emotionalStates.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-white/80 flex items-center text-sm font-medium">
                      <Building2 className="w-4 h-4 mr-2 text-culture/80" />
                      City Influence
                    </label>
                    <Select value={city} onValueChange={setCity}>
                      <SelectTrigger className="w-full bg-black/50 border-culture/30 text-white">
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-culture/20 text-white">
                        {cities.map((city) => (
                          <SelectItem key={city.value} value={city.value}>
                            {city.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Single primary generate button */}
                  <button
                    className="w-full py-3 mt-6 rounded-md font-medium text-white bg-culture hover:bg-culture/90 flex items-center justify-center gap-2 cursor-pointer"
                    onClick={(e) => {
                      console.clear(); // Clear previous logs 
                      console.log('Generate button clicked', e);
                      e.preventDefault();
                      e.stopPropagation();
                      
                      // Try both approaches - setTimeout might be failing in this environment
                      setDebugMessage('Attempting outfit generation with multiple approaches');
                      generateOutfit(); // Standard approach
                      
                      // Fallback: If still not generating after 3 seconds, use direct approach
                      const fallbackTimer = setTimeout(() => {
                        if (!generatedOutfit) {
                          console.log('Falling back to direct state update');
                          setDebugMessage('Falling back to direct approach after timeout');
                          directUpdateState();
                        }
                      }, 3000);
                      
                      return false; // Explicitly return false to prevent default
                    }}
                    disabled={isGenerating}
                    type="button"
                  >
                    {isGenerating ? (
                      <span className="flex items-center">
                        <span className="animate-pulse mr-2">Generating</span>
                        <span className="flex gap-1">
                          <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></span>
                        </span>
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Generate Outfit 
                        <Sparkles className="ml-2 w-4 h-4" />
                      </span>
                    )}
                  </button>
                </div>
              </Card>
            </motion.div>
          </div>
          
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
                    <div className="p-8 rounded-lg bg-black/30 backdrop-blur-md border border-white/10 text-center">
                      <div className="w-24 h-24 rounded-full bg-culture/20 mx-auto flex items-center justify-center mb-4">
                        <Sparkles className="w-10 h-10 text-culture" />
                      </div>
                      <h3 className="text-xl font-medium text-white mb-2">Your Fashion Identity</h3>
                      <p className="text-white/60">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-black/80 p-8 rounded-xl border border-culture/30 flex flex-col items-center">
            <div className="w-20 h-20 border-4 border-culture border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-white text-xl font-medium">Generating your outfit...</div>
            <div className="text-white/60 mt-2">This will take just a moment</div>
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
}

export default OutfitGenerator; 