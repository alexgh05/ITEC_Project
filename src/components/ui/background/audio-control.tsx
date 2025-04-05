import { useState, useEffect } from 'react';
import { Play, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '../button';
import { useThemeStore } from '@/store/useThemeStore';
import { useAudio } from '@/providers/ThemeProvider';

export const AudioControl: React.FC = () => {
  const { culture, cultureInfo } = useThemeStore();
  const { audioRef, isPlaying, isMuted, toggleAudio, toggleMute } = useAudio();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Debug logging for Berlin theme
  useEffect(() => {
    if (culture === 'berlin') {
      console.log('Berlin culture selected:', {
        isPlaying,
        isMuted,
        audioTrack: cultureInfo?.berlin?.sampleTrack,
        currentSrc: audioRef.current?.src,
      });
    }
  }, [culture, isPlaying, isMuted, cultureInfo, audioRef]);
  
  // Handle loading and error states
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handlePlay = () => {
      setIsLoading(false);
      console.log('Audio playing now:', { 
        src: audio.src,
        currentCulture: culture,
        currentTime: audio.currentTime
      });
    };
    
    const handlePause = () => setIsLoading(false);
    const handleLoadStart = () => setIsLoading(true);
    const handleError = (e: ErrorEvent) => {
      console.error("Audio playback error:", e);
      setIsLoading(false);
      setError(`Couldn't play audio for ${culture}. Error: ${e.message || 'Unknown error'}`);
    };
    
    // Add event listeners
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('playing', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('error', handleError as EventListener);
    
    // Cleanup
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('playing', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('error', handleError as EventListener);
    };
  }, [audioRef, culture]);
  
  // Keep these functions for potential use by other components
  const handleTogglePlayback = () => {
    setError(null);
    setIsLoading(true);
    toggleAudio();
  };
  
  const handleToggleMute = () => {
    setError(null);
    toggleMute();
  };
  
  // Return null to hide the component from the UI
  return null;
};

export default AudioControl;
