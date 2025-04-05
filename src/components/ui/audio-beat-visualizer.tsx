import { motion } from 'framer-motion';
import { useAudioVisualizer } from '@/hooks/useAudioVisualizer';
import { useThemeStore } from '@/store/useThemeStore';
import { cn } from '@/lib/utils';

interface AudioBeatVisualizerProps {
  className?: string;
  barCount?: number;
  sensitivity?: number;
  direction?: 'horizontal' | 'vertical';
  barWidth?: number;
  barGap?: number;
  minHeight?: number;
  maxHeight?: number;
  rounded?: boolean;
}

export const AudioBeatVisualizer = ({
  className,
  barCount = 20,
  sensitivity = 1.5,
  direction = 'horizontal',
  barWidth = 3,
  barGap = 2,
  minHeight = 2,
  maxHeight = 40,
  rounded = true,
}: AudioBeatVisualizerProps) => {
  const { audioData } = useAudioVisualizer(barCount, sensitivity);
  const { culture } = useThemeStore();
  
  return (
    <div 
      className={cn(
        'flex items-end justify-center',
        direction === 'horizontal' ? 'flex-row' : 'flex-col',
        className
      )}
    >
      {audioData.map((value, index) => {
        // Calculate dynamic height based on audio data
        const height = minHeight + (value * (maxHeight - minHeight));
        
        return (
          <motion.div
            key={index}
            className={cn(
              'bg-culture/60 backdrop-blur-sm',
              rounded && (direction === 'horizontal' 
                ? 'rounded-t-full' 
                : 'rounded-r-full')
            )}
            style={{
              width: direction === 'horizontal' ? barWidth : height,
              height: direction === 'horizontal' ? height : barWidth,
              marginLeft: direction === 'horizontal' ? barGap : 0,
              marginBottom: direction === 'horizontal' ? 0 : barGap,
            }}
            animate={{ 
              height: direction === 'horizontal' ? height : barWidth,
              width: direction === 'horizontal' ? barWidth : height,
            }}
            transition={{ 
              duration: 0.1,
              ease: "easeOut"
            }}
          />
        );
      })}
    </div>
  );
};

export default AudioBeatVisualizer; 