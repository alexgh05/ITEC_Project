import { useEffect, useState } from 'react';
import { useThemeStore } from '../store/useThemeStore';
import InteractiveBackground from '../components/ui/interactive-background';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { darkMode, culture } = useThemeStore();
  const [appliedTheme, setAppliedTheme] = useState({ darkMode, culture });

  useEffect(() => {
    // Only apply changes when user explicitly updates the theme
    setAppliedTheme({ darkMode, culture });
  }, [darkMode, culture]);

  useEffect(() => {
    // Update the class on the document element
    const html = document.documentElement;
    
    // Handle dark mode
    if (appliedTheme.darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    // Handle culture theme
    html.classList.remove('culture-tokyo', 'culture-newyork', 'culture-lagos', 'culture-seoul', 'culture-london');
    if (appliedTheme.culture !== 'default') {
      html.classList.add(`culture-${appliedTheme.culture}`);
    }
    
    // Set a transition for smooth theme changes
    html.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    
    return () => {
      html.style.transition = '';
    };
  }, [appliedTheme]);

  return (
    <>
      <InteractiveBackground />
      {children}
    </>
  );
};

export default ThemeProvider;
