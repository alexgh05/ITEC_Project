import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CultureTheme = 'default' | 'tokyo' | 'newyork' | 'lagos' | 'seoul' | 'london';

interface CultureInfo {
  name: string;
  description: string;
  primaryColor: string;
  musicGenre: string;
  sampleTrack?: string;
  backgroundPattern: string;
  themeDescription?: string;
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
        },
        tokyo: {
          name: "Tokyo",
          description: "Futuristic streetwear with neon aesthetics",
          primaryColor: "hsl(330, 80%, 60%)",
          musicGenre: "J-Pop & Future Bass",
          sampleTrack: "/audio/tokyo-ambient.mp3",
          backgroundPattern: "neonGrid",
          themeDescription: "Nightlife of Tokyo with neon lights, JDM cars, and Japanese sweets",
        },
        newyork: {
          name: "New York",
          description: "Urban hip-hop inspired fashion",
          primaryColor: "hsl(220, 80%, 50%)",
          musicGenre: "Hip-Hop & Jazz",
          sampleTrack: "/audio/newyork-hiphop.mp3",
          backgroundPattern: "urbanGrids",
          themeDescription: "Dark urban landscape featuring iconic buildings and street culture",
        },
        lagos: {
          name: "Lagos",
          description: "Vibrant Afrobeats culture with bold patterns",
          primaryColor: "hsl(40, 90%, 60%)",
          musicGenre: "Afrobeats & Highlife",
          sampleTrack: "/audio/lagos-beats.mp3",
          backgroundPattern: "africanPatterns",
          themeDescription: "Sunny beaches and vibrant Latin-inspired patterns",
        },
        seoul: {
          name: "Seoul",
          description: "K-pop influenced modern street style",
          primaryColor: "hsl(330, 90%, 65%)",
          musicGenre: "K-Pop & Electronic",
          sampleTrack: "/audio/seoul-kpop.mp3",
          backgroundPattern: "koreanWaves",
          themeDescription: "K-pop inspired with cute aesthetics, pastels, and hearts",
        },
        london: {
          name: "London",
          description: "Electronic music scene with modern clubwear",
          primaryColor: "hsl(200, 80%, 55%)",
          musicGenre: "Electronic & Drum and Bass",
          sampleTrack: "/audio/london-electronic.mp3",
          backgroundPattern: "electronicGrid",
          themeDescription: "London nightlife with LED patterns, club lights, and electronic vibes",
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
