import { useState, useEffect, useRef } from 'react';
import { Music, Heart, Building2, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { OutfitCard } from '@/components/outfit/OutfitCard';
import { toast } from '@/components/ui/use-toast';

// Simple, reliable outfit generator
export const FinalOutfitGenerator = () => {
  const [musicGenre, setMusicGenre] = useState<string>('trap');
  const [emotionalState, setEmotionalState] = useState<string>('energetic');
  const [city, setCity] = useState<string>('tokyo');
  const [generatedOutfit, setGeneratedOutfit] = useState<OutfitResult | null>(null);
  
  // Track previous selections to avoid regenerating the same outfit
  const prevSelectionsRef = useRef({ musicGenre, emotionalState, city });
  
  // Data for selects
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
      'paris': ['#F5D6C6', '#3A3042', '#EF9D87', '#4F5165'],
      'newyork': ['#232528', '#2C55A2', '#D64045', '#F9F9F9'],
      'london': ['#5863F8', '#0E2535', '#EAF205', '#B8EBD0'],
      'seoul': ['#FFB8DE', '#A5AAF2', '#FFF07A', '#121212'],
      'lagos': ['#FFB400', '#3F173F', '#29A0B1', '#E5DDDB'],
      'mumbai': ['#FF7400', '#FFDB58', '#7851A9', '#00539C'],
      'rio': ['#97C93D', '#FCDB00', '#7CBBDE', '#F3752B']
    };
    
    // Outfit names by genre
    const outfitNames = {
      'trap': ['Neon Ronin', 'Street Prophet', 'Urban Samurai', 'Chrome Bandit'],
      'jazz': ['Velvet Noir', 'Midnight Serenade', 'Blue Note Dreamer', 'Smooth Operator'],
      'techno': ['Digital Nomad', 'Cyber Pulse', 'Quantum Drift', 'Electric Horizon'],
      'hiphop': ['Flow Master', 'Concrete Poet', 'Rhythm Rebel', 'Lyrical Ghost'],
      'pop': ['Candy Haze', 'Prism Wave', 'Sparkle Shift', 'Bubblegum Halo'],
      'rock': ['Vintage Vortex', 'Leather Legend', 'Riff Runner', 'Shadow Stance'],
      'latin': ['Tropical Pulse', 'Salsa Sunset', 'Vibrant Rhythm', 'Spice Wave'],
      'kpop': ['Pastel Dream', 'Neon Daydream', 'Soft Focus', 'Candy Floss Warrior']
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
      'jazz': {
        'energetic': 'Kamasi Washington - "The Epic" Triple Vinyl',
        'nostalgic': 'Miles Davis - "Kind of Blue" Classic Vinyl',
        'confident': 'Esperanza Spalding - "Emily\'s D+Evolution" Album'
      },
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
    } else if (city === 'paris' && musicGenre === 'jazz' && emotionalState === 'nostalgic') {
      description = `A sophisticated vintage-inspired look with a modern twist. ${outfitElements.hat} paired with ${outfitElements.tShirt}, ${outfitElements.pants}, and ${outfitElements.accessory}. Complete the vibe with ${musicRecommendation}.`;
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
        'jazz': 'Minimalist fedora with subtle geometric pattern',
        'techno': 'Reflective cap with LED trim',
        'default': 'Structured snapback with kanji embroidery'
      },
      'paris': {
        'jazz': 'Classic beret in muted tones',
        'default': 'Tailored flat cap with subtle check pattern'
      },
      'newyork': {
        'hiphop': 'Vintage Yankees fitted cap',
        'trap': 'High-end designer beanie',
        'default': 'Five-panel camp cap with minimalist graphic'
      },
      'default': 'Structured snapback with urban graphics'
    };
    
    // T-shirt options
    const tShirtOptions = {
      'energetic': {
        'trap': 'Oversized graphic tee with bold digital prints',
        'jazz': 'Slim-fit abstract pattern tee in premium cotton',
        'default': 'Vibrant color-block tee with contrast stitching'
      },
      'nostalgic': {
        'default': 'Vintage-wash band tee with faded graphics'
      },
      'rebellious': {
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
      'paris': {
        'jazz': 'Vintage-inspired pocket watch on a delicate chain',
        'default': 'Artisanal leather wristband with subtle pattern'
      },
      'seoul': {
        'kpop': 'Statement earrings with colorful geometric shapes',
        'default': 'Multi-layer necklace with mixed materials'
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
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">AI Outfit Generator</h1>
        <p className="text-lg mb-10 text-center text-gray-300">
          Create a unique fashion identity based on your preferences
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Inputs */}
          <Card className="p-6 bg-gray-900 border-pink-500/20">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-pink-500" />
              Design Your Style
            </h2>
            
            <div className="space-y-6">
              {/* Music Genre */}
              <div className="space-y-2">
                <label id="music-genre-label" className="text-gray-300 flex items-center text-sm font-medium">
                  <Music className="w-4 h-4 mr-2 text-pink-400" />
                  Music Genre
                </label>
                <Select value={musicGenre} onValueChange={handleMusicGenreChange}>
                  <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select a music genre" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
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
                <label id="emotional-state-label" className="text-gray-300 flex items-center text-sm font-medium">
                  <Heart className="w-4 h-4 mr-2 text-pink-400" />
                  Emotional State
                </label>
                <Select value={emotionalState} onValueChange={handleEmotionalStateChange}>
                  <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select an emotional state" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
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
                <label id="city-label" className="text-gray-300 flex items-center text-sm font-medium">
                  <Building2 className="w-4 h-4 mr-2 text-pink-400" />
                  City Influence
                </label>
                <Select value={city} onValueChange={handleCityChange}>
                  <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {cities.map((city) => (
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
                className="w-full py-3 rounded-md bg-pink-600 hover:bg-pink-500 text-white font-medium transition-all relative"
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
              <div className="flex items-center justify-center h-full bg-gray-900 rounded-lg p-8 border border-gray-800">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-pink-500/20 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-pink-500" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Your Fashion Identity</h3>
                  <p className="text-gray-400">
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