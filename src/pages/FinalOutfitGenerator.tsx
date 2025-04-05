import { useState, useEffect, useRef } from 'react';
import { Music, Heart, Building2, Sparkles, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { OutfitCard } from '@/components/outfit/OutfitCard';
import { toast } from '@/components/ui/use-toast';
import { useThemeStore } from '@/store/useThemeStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';

// Define styles based on dark/light mode
const getStyles = (isDarkMode: boolean) => ({
  text: isDarkMode ? 'text-white' : 'text-gray-900',
  secondaryText: isDarkMode ? 'text-gray-300' : 'text-gray-600',
  card: isDarkMode ? 'bg-black text-white border-gray-800' : 'bg-white text-gray-900 border-gray-200',
  input: isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900',
  button: isDarkMode ? 'bg-pink-600 hover:bg-pink-500' : 'bg-indigo-600 hover:bg-indigo-500',
  iconColor: isDarkMode ? 'text-pink-400' : 'text-indigo-400',
  placeholder: isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
  highlight: isDarkMode ? 'text-pink-500' : 'text-indigo-500',
  placeholderBg: isDarkMode ? 'bg-pink-500/20' : 'bg-indigo-100'
});

// Simple, reliable outfit generator
export const FinalOutfitGenerator = () => {
  // Access theme store for culture theme - moving this to the top
  const { culture, setCulture, cultureInfo, darkMode } = useThemeStore();
  
  // Get styles based on current theme
  const styles = getStyles(darkMode);

  // User auth state
  const { user, isAuthenticated } = useAuthStore();
  
  const [musicGenre, setMusicGenre] = useState<string>('trap');
  const [emotionalState, setEmotionalState] = useState<string>('energetic');
  const [city, setCity] = useState<string>('tokyo');
  const [generatedOutfit, setGeneratedOutfit] = useState<OutfitResult | null>(null);
  
  // Track previous selections to avoid regenerating the same outfit
  const prevSelectionsRef = useRef({ musicGenre, emotionalState, city });
  
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
  
  // Function to get city options based on what's in the theme store
  const getAvailableCities = () => {
    // We're simply returning our cities, filtered to match those available in cultureInfo
    if (cultureInfo) {
      return cities.filter(cityOption => 
        Object.keys(cultureInfo).includes(cityOption.value)
      );
    }
    return cities;
  };
  
  const getMusicGenreLabel = (value: string): string => {
    return musicGenres.find(genre => genre.value === value)?.label || value;
  };
  
  const getEmotionalStateLabel = (value: string): string => {
    return emotionalStates.find(state => state.value === value)?.label || value;
  };
  
  const getCityLabel = (value: string): string => {
    return cities.find(c => c.value === value)?.label || value;
  };
  
  // Update music genre with visual feedback
  const handleMusicGenreChange = (value: string) => {
    setMusicGenre(value);
    if (value !== prevSelectionsRef.current.musicGenre) {
      highlightElement('music-genre-label');
    }
  };
  
  // Update emotional state with visual feedback
  const handleEmotionalStateChange = (value: string) => {
    setEmotionalState(value);
    if (value !== prevSelectionsRef.current.emotionalState) {
      highlightElement('emotional-state-label');
    }
  };
  
  // Update city with visual feedback
  const handleCityChange = (value: string) => {
    setCity(value);
    if (value !== prevSelectionsRef.current.city) {
      highlightElement('city-label');
    }
  };
  
  // Helper function to highlight an element briefly
  const highlightElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.classList.add('text-culture', 'font-bold');
      setTimeout(() => {
        element.classList.remove('text-culture', 'font-bold');
      }, 1500);
    }
  };
  
  // Simple, direct outfit generation without animations or timeouts
  const generateOutfit = () => {
    console.log('Generating outfit with:', { musicGenre, emotionalState, city });
    
    // Check if any selections have changed since last generation
    const prevSelections = prevSelectionsRef.current;
    const hasChanges = 
      prevSelections.musicGenre !== musicGenre ||
      prevSelections.emotionalState !== emotionalState ||
      prevSelections.city !== city;
    
    if (!hasChanges && generatedOutfit) {
      // No changes detected, show a toast message instead of regenerating
      toast({
        title: "Same selections detected",
        description: `Change at least one option to generate a new outfit.`,
        duration: 3000,
      });
      return;
    }
    
    // Update previous selections reference
    prevSelectionsRef.current = { musicGenre, emotionalState, city };
    
    // Color palettes by city
    const colorPalettes = {
      'tokyo': ['#FF2E7E', '#3649FF', '#00F0FF', '#111111'],
      'newyork': ['#232528', '#2C55A2', '#D64045', '#F9F9F9'],
      'london': ['#5863F8', '#0E2535', '#EAF205', '#B8EBD0'],
      'seoul': ['#FFB8DE', '#A5AAF2', '#FFF07A', '#121212'],
      'lagos': ['#FFB400', '#3F173F', '#29A0B1', '#E5DDDB'],
      'berlin': ['#9932CC', '#8A2BE2', '#4B0082', '#191919']
    };
    
    // Outfit names by genre
    const outfitNames = {
      'trap': ['Neon Ronin', 'Street Prophet', 'Urban Samurai', 'Chrome Bandit'],
      'hiphop': ['Flow Master', 'Concrete Poet', 'Rhythm Rebel', 'Lyrical Ghost'],
      'techno': ['Digital Nomad', 'Cyber Pulse', 'Quantum Drift', 'Electric Horizon'],
      'drill': ['Shadow Crew', 'Dark Streets', 'Urban Knight', 'Night Runner'],
      'kpop': ['Pastel Dream', 'Neon Daydream', 'Soft Focus', 'Candy Floss Warrior'],
      'afrobeats': ['Rhythm King', 'Lagos Nights', 'Vibrant Pulse', 'Golden Flow']
    };
    
    // Generate outfit elements based on selections
    const outfitElements = generateOutfitElements(city, musicGenre, emotionalState);
    
    // Music recommendations based on genre and mood
    const musicRecs = {
      'trap': {
        'energetic': 'Future & Metro Boomin - "High Off Life" Mixtape',
        'nostalgic': 'Travis Scott - "Days Before Rodeo" Mixtape',
        'rebellious': 'Playboi Carti - "Whole Lotta Red" Vinyl',
        'romantic': 'PARTYNEXTDOOR - "PARTYMOBILE" Album',
        'melancholic': 'The Weeknd - "After Hours" Vinyl',
        'joyful': 'Lil Uzi Vert - "Eternal Atake" Album',
        'confident': 'Migos - "Culture" Album',
        'mysterious': '21 Savage & Metro Boomin - "Savage Mode II" Vinyl'
      },
      // Additional genres with their mood-based recommendations
      'techno': {
        'energetic': 'Amelie Lens - "Hypnotized" EP',
        'mysterious': 'Gesaffelstein - "Aleph" Vinyl'
      },
      'hiphop': {
        'energetic': 'Kendrick Lamar - "good kid, m.A.A.d city" Album',
        'nostalgic': 'A Tribe Called Quest - "The Low End Theory" Vinyl'
      }
    };
    
    // Get recommendation or default
    const genreRecs = musicRecs[musicGenre] || musicRecs.trap;
    const musicRecommendation = genreRecs[emotionalState] || 
      `${getMusicGenreLabel(musicGenre)} Mix - "${getEmotionalStateLabel(emotionalState)} Waves" Volume 1`;
    
    // Generate outfit
    const colors = colorPalettes[city] || colorPalettes.tokyo;
    const genreNames = outfitNames[musicGenre] || outfitNames.trap;
    const randomName = genreNames[Math.floor(Math.random() * genreNames.length)];
    
    // Create description
    let description = '';
    if (city === 'tokyo' && musicGenre === 'trap' && emotionalState === 'energetic') {
      description = `A futuristic cyberpunk ensemble featuring ${outfitElements.hat}, ${outfitElements.tShirt}, ${outfitElements.pants}, and ${outfitElements.accessory}. Pairs perfectly with ${musicRecommendation}.`;
    } else if (city === 'newyork' && musicGenre === 'hiphop' && emotionalState === 'confident') {
      description = `A bold urban look with authentic New York street style. ${outfitElements.hat} paired with ${outfitElements.tShirt}, ${outfitElements.pants}, and ${outfitElements.accessory}. Complete the vibe with ${musicRecommendation}.`;
    } else if (city === 'london' && musicGenre === 'drill' && emotionalState === 'rebellious') {
      description = `A cutting-edge outfit inspired by London's drill scene. ${outfitElements.hat} matched with ${outfitElements.tShirt}, ${outfitElements.pants}, and ${outfitElements.accessory}. Best enjoyed with ${musicRecommendation}.`;
    } else if (city === 'berlin' && musicGenre === 'techno' && emotionalState === 'mysterious') {
      description = `A sleek Berlin nightlife look with industrial influences. ${outfitElements.hat} combined with ${outfitElements.tShirt}, ${outfitElements.pants}, and ${outfitElements.accessory}. Enhances the experience of ${musicRecommendation}.`;
    } else {
      description = `A unique blend of ${cities.find(c => c.value === city)?.label || city}'s cultural aesthetic and ${musicGenres.find(g => g.value === musicGenre)?.label || musicGenre} influences, expressing a ${emotionalStates.find(e => e.value === emotionalState)?.label || emotionalState} mood. Features ${outfitElements.hat}, ${outfitElements.tShirt}, ${outfitElements.pants}, and ${outfitElements.accessory}. Soundtrack: ${musicRecommendation}.`;
    }
    
    // Create outfit object
    const outfit = {
      name: randomName,
      description: description,
      colorPalette: colors,
      dominantColor: colors[0],
      musicGenre: musicGenre,
      city: city,
      emotionalState: emotionalState,
      imageUrl: `/fashion-placeholder.jpg`, // Fallback to placeholder
      outfitElements: outfitElements,
      musicRecommendation: musicRecommendation
    };
    
    // Update state directly
    setGeneratedOutfit(outfit);
  };
  
  // Function to generate detailed outfit elements based on selections
  const generateOutfitElements = (city: string, genre: string, mood: string) => {
    // Hat options by city and genre
    const hatOptions = {
      'tokyo': {
        'trap': 'Neon bucket hat with holographic details',
        'techno': 'Reflective cap with LED trim',
        'default': 'Structured snapback with kanji embroidery'
      },
      'newyork': {
        'hiphop': 'Vintage Yankees fitted cap',
        'trap': 'High-end designer beanie',
        'default': 'Five-panel camp cap with minimalist graphic'
      },
      'london': {
        'drill': 'Black balaclava with subtle branding',
        'default': 'Signature check pattern bucket hat'
      },
      'default': 'Structured snapback with urban graphics'
    };
    
    // T-shirt options
    const tShirtOptions = {
      'energetic': {
        'trap': 'Oversized graphic tee with bold digital prints',
        'techno': 'Reflective technical tee with minimal design',
        'default': 'Vibrant color-block tee with contrast stitching'
      },
      'rebellious': {
        'drill': 'Dark oversized tee with distressed elements',
        'default': 'Distressed tee with provocative slogans'
      },
      'default': 'Premium cotton tee with subtle tonal embroidery'
    };
    
    // Pants options
    const pantsOptions = {
      'tokyo': {
        'trap': 'Cargo pants with multiple utility pockets and tapered fit',
        'techno': 'Technical joggers with zippered pockets and reflective details',
        'default': 'Wide-leg pants with minimal hardware'
      },
      'newyork': {
        'hiphop': 'Vintage-inspired baggy jeans with subtle distressing',
        'default': 'Slim straight chinos with side tape detail'
      },
      'london': {
        'drill': 'Black tactical joggers with multiple pockets',
        'default': 'Tailored track pants with contrast piping'
      },
      'default': 'Relaxed-fit pants with tonal detailing'
    };
    
    // Accessory options
    const accessoryOptions = {
      'tokyo': {
        'trap': 'Futuristic chunky chain with tech-inspired pendant',
        'techno': 'Smart LED bracelet that pulses with the music',
        'default': 'Minimalist crossbody bag with geometric hardware'
      },
      'newyork': {
        'hiphop': 'Vintage-inspired leather backpack',
        'default': 'Artisanal leather wristband with subtle pattern'
      },
      'seoul': {
        'kpop': 'Statement earrings with colorful geometric shapes',
        'default': 'Multi-layer necklace with mixed materials'
      },
      'london': {
        'drill': 'Statement chain with urban-inspired pendant',
        'default': 'Premium leather belt with matte buckle'
      },
      'lagos': {
        'afrobeats': 'Beaded bracelet with cultural patterns',
        'default': 'Woven statement necklace with natural materials'
      },
      'berlin': {
        'techno': 'Industrial-style pendant with LED accent',
        'default': 'Minimalist watch with unique architectural details'
      },
      'default': 'Statement watch with unique architectural details'
    };
    
    // Helper function to get nested property or default
    const getNestedOption = (options: any, key1: string, key2: string, defaultKey = 'default') => {
      const category = options[key1] || options[defaultKey];
      return (category && category[key2]) || (category && category[defaultKey]) || options[defaultKey];
    };
    
    // Generate each element
    const hat = getNestedOption(hatOptions, city, genre);
    const tShirt = getNestedOption(tShirtOptions, mood, genre);
    const pants = getNestedOption(pantsOptions, city, genre);
    const accessory = getNestedOption(accessoryOptions, city, genre);
    
    return {
      hat,
      tShirt,
      pants,
      accessory
    };
  };

  return (
    <div className="min-h-screen w-full bg-transparent p-6" style={{ backgroundColor: 'transparent' }}>
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-4xl font-bold mb-6 text-center ${styles.text}`}>AI Outfit Generator</h1>
        <p className={`text-lg mb-10 text-center ${styles.secondaryText}`}>
          Create a unique fashion identity based on your preferences
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Inputs */}
          <Card className={`p-6 shadow-sm ${styles.card}`}>
            <h2 className={`text-2xl font-bold mb-6 flex items-center ${styles.text}`}>
              <Sparkles className={`w-5 h-5 mr-2 ${styles.highlight}`} />
              Design Your Style
            </h2>
            
            <div className="space-y-6">
              {/* Music Genre */}
              <div className="space-y-2">
                <label id="music-genre-label" className={`flex items-center text-sm font-medium ${styles.secondaryText}`}>
                  <Music className={`w-4 h-4 mr-2 ${styles.iconColor}`} />
                  Music Genre
                </label>
                <Select value={musicGenre} onValueChange={handleMusicGenreChange}>
                  <SelectTrigger className={`w-full ${styles.input}`}>
                    <SelectValue placeholder="Select a music genre" />
                  </SelectTrigger>
                  <SelectContent className={styles.input}>
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
                <label id="emotional-state-label" className={`flex items-center text-sm font-medium ${styles.secondaryText}`}>
                  <Heart className={`w-4 h-4 mr-2 ${styles.iconColor}`} />
                  Emotional State
                </label>
                <Select value={emotionalState} onValueChange={handleEmotionalStateChange}>
                  <SelectTrigger className={`w-full ${styles.input}`}>
                    <SelectValue placeholder="Select an emotional state" />
                  </SelectTrigger>
                  <SelectContent className={styles.input}>
                    {emotionalStates.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* City */}
              <div className="space-y-2">
                <label id="city-label" className={`flex items-center text-sm font-medium ${styles.secondaryText}`}>
                  <Building2 className={`w-4 h-4 mr-2 ${styles.iconColor}`} />
                  City Influence
                </label>
                <Select value={city} onValueChange={handleCityChange}>
                  <SelectTrigger className={`w-full ${styles.input}`}>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent className={styles.input}>
                    {getAvailableCities().map((city) => (
                      <SelectItem key={city.value} value={city.value}>
                        {city.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Generate Button */}
              <button
                onClick={generateOutfit}
                className={`w-full py-3 rounded-md text-white font-medium transition-all relative ${styles.button}`}
                title="Change at least one selection to generate a new outfit"
              >
                {generatedOutfit ? 'Generate New Outfit' : 'Generate Outfit'}
                {generatedOutfit && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs opacity-70">
                    Change options to refresh
                  </div>
                )}
              </button>
            </div>
          </Card>
          
          {/* Output */}
          <div>
            {generatedOutfit ? (
              <OutfitCard outfit={generatedOutfit} />
            ) : (
              <div className={`flex items-center justify-center h-full rounded-lg p-8 shadow-sm ${styles.placeholder}`}>
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto rounded-full ${styles.placeholderBg} flex items-center justify-center mb-4`}>
                    <Sparkles className={`w-8 h-8 ${styles.highlight}`} />
                  </div>
                  <h3 className={`text-xl font-medium mb-2 ${styles.text}`}>Your Fashion Identity</h3>
                  <p className={styles.secondaryText}>
                    Generate your unique outfit to see your personalized fashion identity
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Type definition
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
}

export default FinalOutfitGenerator; 