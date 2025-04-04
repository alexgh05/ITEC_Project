
import { AudioControl } from './background/audio-control';
import { CanvasBackground } from './background/canvas-background';
import { CultureInfoCard } from './background/culture-info-card';

const InteractiveBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <CanvasBackground />
      <AudioControl />
      <CultureInfoCard />
    </div>
  );
};

export default InteractiveBackground;
