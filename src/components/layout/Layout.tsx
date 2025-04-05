import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import PageTransition from './PageTransition';
import LetterGlitch from '@/components/LetterGlitch';
import { useThemeStore } from '@/store/useThemeStore';

const Layout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { darkMode } = useThemeStore();

  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Increased to 3 seconds to show the animation longer
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-full overflow-hidden">
        <LetterGlitch
          glitchSpeed={100}
          centerVignette={false}
          outerVignette={false}
          smooth={false}
        />
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h1 className={`text-4xl md:text-6xl font-bold z-10 mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
            HypeHeritage
          </h1>
          <p className={`text-xl md:text-3xl z-10 mt-4 font-mono tracking-wider ${darkMode ? 'text-white' : 'text-black'}`}>
            Pl34s3 w41t w3 ar3 5t1ll c0d1ng
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-20">
        <AnimatePresence mode="wait">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
