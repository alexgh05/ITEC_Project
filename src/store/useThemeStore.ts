import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CultureTheme = 'default' | 'tokyo' | 'newyork' | 'lagos' | 'seoul' | 'london' | 'berlin';

interface CultureInfo {
  name: string;
  description: string;
  primaryColor: string;
  musicGenre: string;
  sampleTrack?: string;
  backgroundPattern: string;
  themeDescription?: string;
  rgbColor: string; // RGB values for background color
}

interface ThemeState {
  darkMode: boolean;
  culture: CultureTheme;
  audioEnabled: boolean;
  cultureInfo: Record<CultureTheme, CultureInfo>;
  setDarkMode: (darkMode: boolean) => void;
  setCulture: (culture: CultureTheme) => void;
  toggleDarkMode: () => void;
  toggleAudio: () => void;
  enableAudio: () => void;
  disableAudio: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      darkMode: false,
      culture: 'default',
      audioEnabled: false,
      cultureInfo: {
        default: {
          name: "Default",
          description: "Select a culture to experience its unique style",
          primaryColor: "hsl(240, 6%, 10%)",
          musicGenre: "Ambient",
          backgroundPattern: "defaultPattern",
          rgbColor: "0, 0, 0",
        },
        tokyo: {
          name: "Tokyo",
          description: "Futuristic streetwear with neon aesthetics",
          primaryColor: "hsl(330, 80%, 60%)",
          musicGenre: "J-Pop & Future Bass",
          sampleTrack: "/audio/tokyo-ambient.mp3",
          backgroundPattern: "neonGrid",
          themeDescription: "Nightlife of Tokyo with neon lights, JDM cars, and Japanese sweets",
          rgbColor: "20, 10, 40",
        },
        newyork: {
          name: "New York",
          description: "Urban hip-hop inspired fashion",
          primaryColor: "hsl(220, 80%, 50%)",
          musicGenre: "Hip-Hop & Jazz",
          sampleTrack: "/audio/newyork-hiphop.mp3",
          backgroundPattern: "urbanGrids",
          themeDescription: "Dark urban landscape featuring iconic buildings and street culture",
          rgbColor: "35, 42, 50",
        },
        lagos: {
          name: "Lagos",
          description: "Vibrant Afrobeats culture with bold patterns",
          primaryColor: "hsl(40, 90%, 60%)",
          musicGenre: "Afrobeats & Highlife",
          sampleTrack: "/audio/lagos-beats.mp3",
          backgroundPattern: "africanPatterns",
          themeDescription: "Sunny beaches and vibrant Latin-inspired patterns",
          rgbColor: "255, 180, 0",
        },
        seoul: {
          name: "Seoul",
          description: "K-pop influenced modern street style",
          primaryColor: "hsl(330, 90%, 65%)",
          musicGenre: "K-Pop & Electronic",
          sampleTrack: "/audio/seoul-kpop.mp3",
          backgroundPattern: "koreanWaves",
          themeDescription: "K-pop inspired with cute aesthetics, pastels, and hearts",
          rgbColor: "89, 65, 169",
        },
        london: {
          name: "London",
          description: "UK Drill music scene with modern streetwear",
          primaryColor: "hsl(200, 80%, 55%)",
          musicGenre: "Drill",
          sampleTrack: "/audio/london-electronic.mp3",
          backgroundPattern: "electronicGrid",
          themeDescription: "London nightlife with balaclavas, football jerseys, and drill music",
          rgbColor: "44, 62, 80",
        },
        berlin: {
          name: "Berlin",
          description: "Techno music scene with futuristic clubwear",
          primaryColor: "hsl(280, 70%, 50%)",
          musicGenre: "Electronic and Techno",
          sampleTrack: "/audio/berlin-techno.mp3",
          backgroundPattern: "technoGrid",
          themeDescription: "Berlin underground techno scene with industrial aesthetics and dark tones",
          rgbColor: "50, 23, 77",
        },
      },
      setDarkMode: (darkMode) => set({ darkMode }),
      setCulture: (culture) => set((state) => {
        // If changing from default to a culture with music, enable audio
        const shouldEnableAudio = 
          state.culture === 'default' && 
          culture !== 'default' && 
          !state.audioEnabled;
          
        return { 
          culture,
          // Enable audio if appropriate
          audioEnabled: shouldEnableAudio ? true : state.audioEnabled
        };
      }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
      enableAudio: () => set({ audioEnabled: true }),
      disableAudio: () => set({ audioEnabled: false }),
    }),
    {
      name: 'culture-drop-theme',
    }
  )
);
