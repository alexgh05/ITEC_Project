import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getTranslation, TranslationKey, Language } from '@/lib/translations';

interface LocalizedMetaProps {
  titleKey?: TranslationKey;
  titleFallback?: string;
  descriptionKey?: TranslationKey;
  descriptionFallback?: string;
  titleSuffix?: boolean;
  languagePrefix?: boolean;
  canonicalPath?: string;
  imageUrl?: string;
  // For dynamic translations that aren't in the main translation object
  dynamicTitle?: {
    [key in Language]?: string;
  };
  dynamicDescription?: {
    [key in Language]?: string;
  };
}

/**
 * A component for managing localized meta tags and document titles for SEO
 */
const LocalizedMeta = ({
  titleKey,
  titleFallback = 'HypeHeritage',
  descriptionKey,
  descriptionFallback = 'Music & Fashion Concept Shop',
  titleSuffix = true,
  languagePrefix = false,
  canonicalPath,
  imageUrl = '/assets/logo/hypeheritage-logo.svg',
  dynamicTitle,
  dynamicDescription
}: LocalizedMetaProps) => {
  const { language } = useLanguageStore();
  
  // Generate localized title
  const getLocalizedTitle = (): string => {
    let title = '';
    
    // Try to get title from translation key
    if (titleKey) {
      title = getTranslation(titleKey, language);
    } 
    // Try to get title from dynamic object
    else if (dynamicTitle) {
      const translationForLanguage = dynamicTitle[language];
      if (translationForLanguage) {
        title = translationForLanguage;
      } else {
        // Fallback to English or first available language
        title = dynamicTitle['en'] || Object.values(dynamicTitle)[0] || titleFallback;
      }
    } 
    // Use fallback
    else {
      title = titleFallback;
    }
    
    // Add language prefix if needed
    if (languagePrefix) {
      title = `[${language.toUpperCase()}] ${title}`;
    }
    
    // Add app name suffix if needed
    if (titleSuffix) {
      title = `${title} | HypeHeritage`;
    }
    
    return title;
  };
  
  // Generate localized description
  const getLocalizedDescription = (): string => {
    if (descriptionKey) {
      return getTranslation(descriptionKey, language);
    } 
    
    if (dynamicDescription) {
      const translationForLanguage = dynamicDescription[language];
      if (translationForLanguage) {
        return translationForLanguage;
      }
      
      return dynamicDescription['en'] || Object.values(dynamicDescription)[0] || descriptionFallback;
    }
    
    return descriptionFallback;
  };
  
  const title = getLocalizedTitle();
  const description = getLocalizedDescription();
  
  // Determine canonical URL
  const getCanonicalUrl = (): string => {
    const baseUrl = window.location.origin;
    if (canonicalPath) {
      return `${baseUrl}${canonicalPath.startsWith('/') ? '' : '/'}${canonicalPath}`;
    }
    return window.location.href.split('?')[0]; // Remove query params
  };
  
  // Get language-specific meta tags
  const getLanguageMetaTags = () => {
    const tags = [];
    
    // Add hreflang tags for all supported languages
    const languages: Language[] = ['en', 'ro', 'es', 'de'];
    const currentPath = canonicalPath || window.location.pathname;
    
    languages.forEach(lang => {
      tags.push(
        <link 
          key={`hreflang-${lang}`}
          rel="alternate" 
          hrefLang={lang} 
          href={`${window.location.origin}${currentPath}?lang=${lang}`}
        />
      );
    });
    
    // Add x-default hreflang
    tags.push(
      <link 
        key="hreflang-default"
        rel="alternate" 
        hrefLang="x-default" 
        href={`${window.location.origin}${currentPath}`}
      />
    );
    
    return tags;
  };
  
  return (
    <Helmet>
      <html lang={language} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={getCanonicalUrl()} />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl.startsWith('http') ? imageUrl : `${window.location.origin}${imageUrl}`} />
      <meta property="og:url" content={getCanonicalUrl()} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={language} />
      
      {/* Twitter card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl.startsWith('http') ? imageUrl : `${window.location.origin}${imageUrl}`} />
      
      {/* Language alternates */}
      {getLanguageMetaTags()}
    </Helmet>
  );
};

export default LocalizedMeta; 