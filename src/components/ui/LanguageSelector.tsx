import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getTranslation, Language } from '@/lib/translations';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'buttons' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
}

const LanguageSelector = ({ 
  variant = 'dropdown',
  size = 'md'
}: LanguageSelectorProps) => {
  const { language, setLanguage } = useLanguageStore();
  
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  const languageFlags: Record<Language, string> = {
    en: '🇬🇧',
    ro: '🇷🇴',
    es: '🇪🇸',
    de: '🇩🇪'
  };

  const languageNames = {
    en: getTranslation('english', language),
    ro: getTranslation('romanian', language),
    es: getTranslation('spanish', language),
    de: getTranslation('german', language)
  };

  // Different types of selectors
  if (variant === 'buttons') {
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.keys(languageFlags).map((lang) => (
          <Button 
            key={lang}
            variant={language === lang ? 'default' : 'outline'} 
            size={size === 'lg' ? 'default' : 'sm'}
            onClick={() => handleLanguageChange(lang as Language)}
            className="flex items-center gap-2"
          >
            <span>{languageFlags[lang as Language]}</span>
            {size !== 'sm' && <span>{languageNames[lang as Language]}</span>}
          </Button>
        ))}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className="flex space-x-2 items-center">
        <Globe className={`h-${size === 'sm' ? '3' : size === 'lg' ? '5' : '4'} w-${size === 'sm' ? '3' : size === 'lg' ? '5' : '4'}`} />
        <div className="flex space-x-1">
          {Object.keys(languageFlags).map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang as Language)}
              className={`text-${size === 'sm' ? 'xs' : size === 'lg' ? 'base' : 'sm'} px-1 py-0.5 rounded ${
                language === lang 
                  ? 'font-bold text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {languageFlags[lang as Language]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Default dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size={size === 'lg' ? 'default' : 'sm'} 
          className="flex items-center gap-2"
        >
          <Globe className={`h-${size === 'sm' ? '3' : size === 'lg' ? '5' : '4'} w-${size === 'sm' ? '3' : size === 'lg' ? '5' : '4'}`} />
          <span>{languageFlags[language]}</span>
          {size !== 'sm' && <span>{getTranslation('language', language)}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.keys(languageFlags).map((lang) => (
          <DropdownMenuItem 
            key={lang}
            onClick={() => handleLanguageChange(lang as Language)} 
            className="flex items-center gap-2"
          >
            <span>{languageFlags[lang as Language]}</span>
            <span>{languageNames[lang as Language]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector; 