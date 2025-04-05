import { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import PageTransition from './PageTransition';
import LetterGlitch from '@/components/LetterGlitch';
import { useThemeStore } from '@/store/useThemeStore';
import { useAudio } from '@/providers/ThemeProvider';
import InteractiveBackground from '@/components/ui/interactive-background';

const Layout = () => {
  // Initialize loading state based on session storage to prevent flash
  const hasVisitedInSession = sessionStorage.getItem('hasVisitedInSession') === 'true';
  const [isLoading, setIsLoading] = useState(!hasVisitedInSession);
  const [resourcesLoaded, setResourcesLoaded] = useState(false);
  
  const { darkMode, setCulture } = useThemeStore();
  const { toggleAudio, isPlaying } = useAudio();
  const hasInitialized = useRef(false);
  const [showBackground, setShowBackground] = useState(false);

  // Set Tokyo theme and auto-play music after loading
  useEffect(() => {
    if (!isLoading && !hasInitialized.current) {
      // Set flag to prevent repeated execution
      hasInitialized.current = true;
      
      // Set Tokyo theme
      setCulture('tokyo');
      
      // Show background with a small delay
      setTimeout(() => {
        setShowBackground(true);
      }, 100);
      
      // Auto-play music if not already playing
      if (!isPlaying) {
        // Use a small timeout to prevent potential race conditions
        setTimeout(() => {
          toggleAudio();
        }, 500);
      }
    }
  }, [isLoading, setCulture, toggleAudio, isPlaying]);

  // Check if resources are loaded
  useEffect(() => {
    if (hasVisitedInSession) {
      // Skip loading check for returning visitors
      setResourcesLoaded(true);
      return;
    }
    
    // Function to check if critical resources are loaded
    const checkResourcesLoaded = () => {
      if (document.readyState === 'complete') {
        setResourcesLoaded(true);
      }
    };

    // Check initial state
    checkResourcesLoaded();
    
    // Listen for load event
    window.addEventListener('load', checkResourcesLoaded);
    
    // Clean up
    return () => window.removeEventListener('load', checkResourcesLoaded);
  }, [hasVisitedInSession]);

  // Handle minimum loading time and session storage
  useEffect(() => {
    // Only run timer for the loading screen if it's a first visit in this session
    if (!hasVisitedInSession) {
      // Minimum loading time of 3 seconds
      const minLoadingTimer = setTimeout(() => {
        // Only hide loading screen if resources are actually loaded
        if (resourcesLoaded) {
          setIsLoading(false);
          // Set sessionStorage flag to indicate user has visited in this session
          sessionStorage.setItem('hasVisitedInSession', 'true');
        }
      }, 3000);
      
      return () => clearTimeout(minLoadingTimer);
    }
  }, [hasVisitedInSession, resourcesLoaded]);

  // Effect to hide loading screen when resources are loaded (after minimum time)
  useEffect(() => {
    if (!hasVisitedInSession && resourcesLoaded && isLoading) {
      // Check if 3 seconds have passed since component mounted
      const loadStartTime = performance.now();
      const checkTimeAndHideLoader = () => {
        const elapsed = performance.now() - loadStartTime;
        if (elapsed >= 3000) {
          setIsLoading(false);
          sessionStorage.setItem('hasVisitedInSession', 'true');
        } else {
          // Check again after the remaining time
          setTimeout(checkTimeAndHideLoader, 3000 - elapsed);
        }
      };
      
      checkTimeAndHideLoader();
    }
  }, [resourcesLoaded, hasVisitedInSession, isLoading]);

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
      {showBackground && <InteractiveBackground />}
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
