
import { motion } from 'framer-motion';
import { useThemeStore } from '@/store/useThemeStore';

export const CultureInfoCard: React.FC = () => {
  const { culture, cultureInfo } = useThemeStore();
  
  return (
    <motion.div 
      className="absolute bottom-16 right-4 p-3 rounded-lg bg-background/70 backdrop-blur-sm shadow-lg pointer-events-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: culture !== 'default' ? 1 : 0, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-sm font-medium">{cultureInfo[culture].name} Style</div>
      <div className="text-xs text-muted-foreground">{cultureInfo[culture].musicGenre}</div>
      {cultureInfo[culture].themeDescription && (
        <div className="text-xs mt-1 text-muted-foreground">
          {cultureInfo[culture].themeDescription}
        </div>
      )}
    </motion.div>
  );
};

export default CultureInfoCard;
