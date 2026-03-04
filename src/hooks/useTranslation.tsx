'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import enTranslations from '@/translations/en.json';
import deTranslations from '@/translations/de.json';

type TranslationKey = string;
type Translations = typeof enTranslations;

interface TranslationContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: TranslationKey) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const translations: Record<string, Translations> = {
  en: enTranslations,
  de: deTranslations,
};

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [language, setLanguageState] = useState<string>('en');

  useEffect(() => {
    // Detect browser language and set initial language
    const detectBrowserLanguage = () => {
      // Try saved language first
      const savedLanguage = localStorage.getItem('ipma-quiz-language');
      if (savedLanguage && translations[savedLanguage]) {
        return savedLanguage;
      }
      
      // Detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('de')) {
        return 'de';
      } else if (browserLang.startsWith('en')) {
        return 'en';
      }
      
      // Default fallback
      return 'en';
    };

    const detectedLanguage = detectBrowserLanguage();
    setLanguageState(detectedLanguage);
  }, []);

  const setLanguage = (newLanguage: string) => {
    if (translations[newLanguage]) {
      setLanguageState(newLanguage);
      localStorage.setItem('ipma-quiz-language', newLanguage);
    }
  };

  const t = (key: TranslationKey): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = translations['en'];
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return the key if translation not found
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
