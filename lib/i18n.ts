import azTranslations from '@/locales/az.json';
import enTranslations from '@/locales/en.json';
import ruTranslations from '@/locales/ru.json';

export type Language = 'az' | 'en' | 'ru';

export const defaultLanguage: Language = 'az';
export const supportedLanguages: Language[] = ['az', 'en', 'ru'];

export const languageNames: Record<Language, string> = {
  az: 'Azərbaycan',
  en: 'English',
  ru: 'Русский',
};

// Translation keys type - will be generated from translation files
export type TranslationKey = string;

const translationsMap: Record<Language, any> = {
  az: azTranslations,
  en: enTranslations,
  ru: ruTranslations,
};

let currentLanguage: Language = defaultLanguage;
let translations: Record<string, any> = translationsMap[defaultLanguage];

export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
  }
};

export const getLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('language') as Language;
    if (stored && supportedLanguages.includes(stored)) {
      return stored;
    }
  }
  return currentLanguage;
};

export const loadTranslations = (lang: Language): Record<string, any> => {
  try {
    if (translationsMap[lang]) {
      translations = translationsMap[lang];
      currentLanguage = lang;
      return translations;
    }
    // Fallback to default language
    if (lang !== defaultLanguage) {
      return loadTranslations(defaultLanguage);
    }
    return translationsMap[defaultLanguage] || {};
  } catch (error) {
    console.error(`Failed to load translations for ${lang}:`, error);
    // Fallback to default language
    if (lang !== defaultLanguage) {
      return loadTranslations(defaultLanguage);
    }
    return translationsMap[defaultLanguage] || {};
  }
};

export const t = (key: string, params?: Record<string, string | number>): string => {
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

// Initialize language on load
if (typeof window !== 'undefined') {
  const storedLang = localStorage.getItem('language') as Language;
  if (storedLang && supportedLanguages.includes(storedLang)) {
    currentLanguage = storedLang;
  }
}

