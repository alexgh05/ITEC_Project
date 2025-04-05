import { useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getTranslation, TranslationKey, Language } from '@/lib/translations';

interface TitleOptions {
  suffix?: boolean; // Whether to add the app name suffix
  languagePrefix?: boolean; // Whether to add the language code prefix
}

/**
 * Custom hook for setting localized document titles
 * @param titleKey The translation key for the title
 * @param titleParams Dynamic parameters for the title, if any
 * @param options Additional options for customizing the title
 */
export function useDocumentTitle(
  titleKey: TranslationKey | { [key in Language]?: string },
  titleParams?: string[], 
  options: TitleOptions = { suffix: true, languagePrefix: false }
) {
  const { language } = useLanguageStore();
  
  useEffect(() => {
    let title = '';
    
    // If titleKey is a translation key, get the translation
    if (typeof titleKey === 'string') {
      title = getTranslation(titleKey as TranslationKey, language);
      
      // Replace any parameters in the title
      if (titleParams && titleParams.length > 0) {
        titleParams.forEach((param, index) => {
          title = title.replace(`{${index}}`, param);
        });
      }
    } 
    // If titleKey is an object with translations for each language
    else {
      const translationForLanguage = titleKey[language];
      if (translationForLanguage) {
        title = translationForLanguage;
      } else {
        // Fallback to English or first available language
        title = titleKey['en'] || Object.values(titleKey)[0] || 'HypeHeritage';
      }
    }
    
    // Add language prefix if needed
    if (options.languagePrefix) {
      title = `[${language.toUpperCase()}] ${title}`;
    }
    
    // Add app name suffix if needed
    if (options.suffix) {
      title = `${title} | HypeHeritage`;
    }
    
    document.title = title;
    
    // Add meta tags for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', `HypeHeritage - ${title}`);
    }
    
    return () => {
      // Cleanup if needed
    };
  }, [titleKey, titleParams, language, options]);
}

export default useDocumentTitle; 