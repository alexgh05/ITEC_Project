import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

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
  const [audioData, setAudioData] = useState<number[]>(Array(barCount).fill(0));
  
  // Simulate audio data instead of using real audio
  useEffect(() => {
    // Generate random data for initial render
    setAudioData(Array(barCount).fill(0).map(() => Math.random()));
    
    // Simulate changing audio data
    const interval = setInterval(() => {
      setAudioData(prev => 
        prev.map(val => {
          // Create smooth transitions between values
          const change = (Math.random() - 0.5) * 0.3;
          return Math.max(0.1, Math.min(1, val + change));
        })
      );
    }, 150);
    
    return () => clearInterval(interval);
  }, [barCount]);
  
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
              'bg-pink-500/60 backdrop-blur-sm',
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