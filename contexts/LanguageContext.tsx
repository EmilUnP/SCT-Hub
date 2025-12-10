"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, getLanguage, setLanguage as setLang, loadTranslations, supportedLanguages, defaultLanguage } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize with default language translations immediately to avoid empty state
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [isLoading, setIsLoading] = useState(false);
  const [translations, setTranslations] = useState<Record<string, any>>(
    loadTranslations(defaultLanguage)
  );

  useEffect(() => {
    const initLanguage = () => {
      const currentLang = getLanguage();
      setLanguageState(currentLang);
      // Load translations synchronously since they're already imported
      const loadedTranslations = loadTranslations(currentLang);
      setTranslations(loadedTranslations);
    };

    initLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    if (!supportedLanguages.includes(lang)) return;
    
    setIsLoading(true);
    setLang(lang);
    // Load translations synchronously since they're already imported
    const loadedTranslations = loadTranslations(lang);
    setTranslations(loadedTranslations);
    setLanguageState(lang);
    // Small delay to ensure state updates
    setTimeout(() => setIsLoading(false), 0);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Replace parameters
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

