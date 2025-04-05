import { CanvasBackground } from './background/canvas-background';
import { useThemeStore } from '@/store/useThemeStore';

const InteractiveBackground = () => {
  const { culture } = useThemeStore();
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <CanvasBackground />
    </div>
  );
};

export default InteractiveBackground; 