import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Moon, Sun, LogIn, User, LogOut, Globe, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/store/useThemeStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getTranslation, Language } from '@/lib/translations';
import { cn } from '@/lib/utils';
import CartDropdown from './CartDropdown';
import { useAuth } from '@/providers/AuthProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();
  const { user, isAuthenticated, logout } = useAuth();
  
  const navLinks = [
    { name: getTranslation('home', language), path: '/' },
    { name: getTranslation('shop', language), path: '/shop' },
    { name: getTranslation('cultures', language), path: '/cultures' },
    { 
      name: getTranslation('outfitGenerator', language), 
      path: '/outfit-generator',
      icon: <Sparkles className="h-4 w-4 text-culture" />
    },
    { name: getTranslation('wishlist', language), path: '/wishlist' },
    { name: getTranslation('cart', language), path: '/cart' },
    { name: getTranslation('about', language), path: '/about' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    // Optionally, you could redirect to the home page
    // window.location.href = '/';
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  const languageFlags: Record<Language, string> = {
    en: '🇬🇧',
    ro: '🇷🇴',
    es: '🇪🇸',
    de: '🇩🇪'
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "py-2 bg-background/80 backdrop-blur-md shadow-sm" 
          : "py-4 bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-foreground"
          >
            CultureDrop
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              {link.icon && link.icon}
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label="Select language">
                <Globe className="h-5 w-5" />
                <span className="absolute -bottom-1 -right-1 text-xs">{languageFlags[language]}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleLanguageChange('en')} className="flex items-center gap-2">
                <span>🇬🇧</span> {getTranslation('english', language)}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange('ro')} className="flex items-center gap-2">
                <span>🇷🇴</span> {getTranslation('romanian', language)}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange('es')} className="flex items-center gap-2">
                <span>🇪🇸</span> {getTranslation('spanish', language)}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange('de')} className="flex items-center gap-2">
                <span>🇩🇪</span> {getTranslation('german', language)}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {user?.name || getTranslation('profile', language)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">{getTranslation('profile', language)}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">{getTranslation('myOrders', language)}</Link>
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">{getTranslation('adminDashboard', language)}</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    {getTranslation('logout', language)}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login" className="flex items-center gap-1">
                    <LogIn className="h-4 w-4" />
                    {getTranslation('login', language)}
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">{getTranslation('register', language)}</Link>
                </Button>
              </>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode} 
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          
          <CartDropdown />
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-background z-50 md:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="text-xl font-bold">CultureDrop</div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </Button>
              </div>
              <nav className="flex flex-col p-4 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-lg font-medium py-2 flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.icon && link.icon}
                    {link.name}
                  </Link>
                ))}
                
                {/* Language selector for mobile */}
                <div className="border-t my-2 pt-4">
                  <div className="text-lg font-medium py-2">{getTranslation('language', language)}</div>
                  <div className="grid grid-cols-2 gap-2 py-2">
                    <Button 
                      variant={language === 'en' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => handleLanguageChange('en')}
                      className="flex items-center justify-center gap-2"
                    >
                      <span>🇬🇧</span> {getTranslation('english', language)}
                    </Button>
                    <Button 
                      variant={language === 'ro' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => handleLanguageChange('ro')}
                      className="flex items-center justify-center gap-2"
                    >
                      <span>🇷🇴</span> {getTranslation('romanian', language)}
                    </Button>
                    <Button 
                      variant={language === 'es' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => handleLanguageChange('es')}
                      className="flex items-center justify-center gap-2"
                    >
                      <span>🇪🇸</span> {getTranslation('spanish', language)}
                    </Button>
                    <Button 
                      variant={language === 'de' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => handleLanguageChange('de')}
                      className="flex items-center justify-center gap-2"
                    >
                      <span>🇩🇪</span> {getTranslation('german', language)}
                    </Button>
                  </div>
                </div>
                
                {/* Authentication Links for Mobile */}
                <div className="border-t my-2 pt-4">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 text-lg font-medium py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        {getTranslation('profile', language)}
                      </Link>
                      <Link
                        to="/orders"
                        className="text-lg font-medium py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {getTranslation('myOrders', language)}
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="text-lg font-medium py-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {getTranslation('adminDashboard', language)}
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-2 text-lg font-medium py-2 text-destructive"
                      >
                        <LogOut className="h-5 w-5" />
                        {getTranslation('logout', language)}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="flex items-center gap-2 text-lg font-medium py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <LogIn className="h-5 w-5" />
                        {getTranslation('login', language)}
                      </Link>
                      <Link
                        to="/register"
                        className="text-lg font-medium py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {getTranslation('register', language)}
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
