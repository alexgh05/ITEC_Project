import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import InteractiveBackground from '@/components/ui/interactive-background';
import { AudioControl } from '@/components/ui/background/audio-control';

type ThemeProviderProps = {
  children: React.ReactNode;
};

// Create a context for global audio
const AudioContextInternal = createContext<{
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  isMuted: boolean;
  toggleAudio: () => void;
  toggleMute: () => void;
}>({
  audioRef: { current: null },
  isPlaying: false,
  isMuted: false,
  toggleAudio: () => {},
  toggleMute: () => {},
});

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { darkMode, culture, cultureInfo, audioEnabled, enableAudio } = useThemeStore();
  const [appliedTheme, setAppliedTheme] = useState({ darkMode, culture });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const defaultVolume = 0.3;
  
  // Initialize audio element once
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.loop = true;
      audio.volume = defaultVolume;
      audioRef.current = audio;
    }

    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);
  
  // Track user interaction
  useEffect(() => {
    const handleInteraction = () => {
      setHasUserInteracted(true);
      // Remove the event listeners once the user has interacted
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
    
    // Add event listeners to detect user interaction
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('scroll', handleInteraction);
    
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
  }, []);
  
  // Autoplay audio when page loads (after user interaction)
  useEffect(() => {
    // Only try to autoplay if:
    // 1. User has interacted with the page (browser requirement)
    // 2. Audio is not already playing
    // 3. We have a culture with music selected
    if (hasUserInteracted && !isPlaying && culture !== 'default' && cultureInfo && cultureInfo[culture] && cultureInfo[culture].sampleTrack) {
      // Enable audio in the store if it's not already enabled
      if (!audioEnabled) {
        enableAudio();
      }
      
      const audio = audioRef.current;
      if (!audio) return;
      
      // Set the audio source
      const trackSrc = cultureInfo[culture].sampleTrack;
      if (!trackSrc) return;
      
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      audio.src = `${trackSrc}?t=${timestamp}`;
      
      // Try to play the audio
      audio.play()
        .then(() => {
          console.log('Autoplay started successfully');
          setIsPlaying(true);
        })
        .catch(err => {
          console.error('Autoplay failed:', err);
          // We tried, but autoplay was blocked. That's fine.
        });
    }
  }, [hasUserInteracted, isPlaying, culture, cultureInfo, audioEnabled, enableAudio]);

  // Update audio source when culture changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
 main
    const trackSrc = cultureInfo[culture].sampleTrack;
    if (!trackSrc) return;
    
    // Only change if playing or if audio should be enabled
    if (isPlaying || (audioEnabled && culture !== 'default')) {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      audio.src = `${trackSrc}?t=${timestamp}`;
      
      // Only attempt to play if user has interacted with the page
      if (hasUserInteracted && (isPlaying || (audioEnabled && culture !== 'default'))) {
        audio.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(err => {
            console.error("Audio playback error on culture change:", err);
            setIsPlaying(false);
          });
      }
    }
  }, [culture, cultureInfo, isPlaying, audioEnabled, hasUserInteracted]);

  // Toggle audio playback
  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // Ensure audio is enabled in the store
      if (!audioEnabled) {
        enableAudio();
      }
      
      // Set audio source if not already set
      if (!audio.src || audio.src === '') {
        // Add null check for culture info
        if (!cultureInfo || !cultureInfo[culture] || !cultureInfo[culture].sampleTrack) return;
        
        const trackSrc = cultureInfo[culture].sampleTrack;
        if (!trackSrc) return;
        
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        audio.src = `${trackSrc}?t=${timestamp}`;
      }
      
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error("Audio playback error:", err);
        });
    }
  };

  // Toggle mute functionality
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isMuted) {
      // Unmute - restore volume
      audio.volume = defaultVolume;
      setIsMuted(false);
    } else {
      // Mute - set volume to 0
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  useEffect(() => {
    // Only apply changes when user explicitly updates the theme
    setAppliedTheme({ darkMode, culture });
  }, [darkMode, culture]);

  useEffect(() => {
    // Update the class on the document element
    const html = document.documentElement;
    
    // Handle dark mode
    if (appliedTheme.darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    // Handle culture theme
    html.classList.remove('culture-tokyo', 'culture-newyork', 'culture-lagos', 'culture-seoul', 'culture-london', 'culture-berlin');
    if (appliedTheme.culture !== 'default') {
      html.classList.add(`culture-${appliedTheme.culture}`);
    }
    
    // Set a transition for smooth theme changes
    html.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    
    return () => {
      html.style.transition = '';
    };
  }, [appliedTheme]);

  return (
    <AudioContextInternal.Provider value={{ audioRef, isPlaying, isMuted, toggleAudio, toggleMute }}>
      <InteractiveBackground />
      {children}
      <AudioControl />
    </AudioContextInternal.Provider>
  );
};

export default ThemeProvider;

// Export the AudioContext separately as a named export
export const AudioContext = AudioContextInternal;

// Helper hook to use audio
export const useAudio = () => useContext(AudioContextInternal);
