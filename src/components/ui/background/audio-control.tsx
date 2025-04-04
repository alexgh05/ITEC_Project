
import { useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '../button';
import { useThemeStore } from '@/store/useThemeStore';

export const AudioControl: React.FC = () => {
  const { culture, cultureInfo, audioEnabled, toggleAudio } = useThemeStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (audioEnabled && cultureInfo[culture].sampleTrack && audioRef.current) {
      audioRef.current.src = cultureInfo[culture].sampleTrack || '';
      audioRef.current.volume = 0.3;
      audioRef.current.loop = true;
      audioRef.current.play().catch(err => console.log("Audio autoplay prevented", err));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [culture, audioEnabled, cultureInfo]);
  
  return (
    <>
      <audio ref={audioRef} />
      
      <div className="absolute bottom-4 right-4 pointer-events-auto">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80"
          onClick={toggleAudio}
          title={audioEnabled ? "Mute background music" : "Play background music"}
        >
          {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </Button>
      </div>
    </>
  );
};

export default AudioControl;
