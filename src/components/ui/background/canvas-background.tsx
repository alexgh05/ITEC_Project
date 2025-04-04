
import { useRef, useEffect } from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import { drawTokyoBackground } from './tokyo-background';
import { drawNewYorkBackground } from './newyork-background';
import { drawLagosBackground } from './lagos-background';
import { drawSeoulBackground } from './seoul-background';
import { drawLondonBackground } from './london-background';
import { drawDefaultBackground } from './default-background';

export const CanvasBackground: React.FC = () => {
  const { culture } = useThemeStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full viewport size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Different animation patterns based on culture
    const drawBackground = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      switch(culture) {
        case 'tokyo':
          drawTokyoBackground(ctx, canvas);
          break;
        case 'newyork':
          drawNewYorkBackground(ctx, canvas);
          break;
        case 'lagos':
          drawLagosBackground(ctx, canvas);
          break;
        case 'seoul':
          drawSeoulBackground(ctx, canvas);
          break;
        case 'london':
          drawLondonBackground(ctx, canvas);
          break;
        default:
          drawDefaultBackground(ctx, canvas);
          break;
      }
      
      animationRef.current = requestAnimationFrame(drawBackground);
    };
    
    drawBackground();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [culture]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full"
      style={{ opacity: 0.6 }}
    />
  );
};

export default CanvasBackground;
