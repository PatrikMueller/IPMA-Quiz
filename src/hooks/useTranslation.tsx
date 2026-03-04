'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import enTranslations from '@/translations/en.json';

type TranslationKey = string;
type Translations = typeof enTranslations;

interface TranslationContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: TranslationKey) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  // Always use English - no language switching needed
  const language = 'en';
  
  // Keep setLanguage for compatibility but it does nothing
  const setLanguage = (newLanguage: string) => {
    // No-op: Always stay in English
  };

  const t = (key: TranslationKey): string => {
    const keys = key.split('.');
    let value: any = enTranslations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return the key if translation not found
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
