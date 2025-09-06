'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from '@/locales/en.json';
import ja from '@/locales/ja.json';

type Locale = 'en' | 'ja';
type Dict = typeof en;

const resources: Record<Locale, Dict> = { en, ja };

function getByPath(obj: any, path: string): any {
  return path.split('.').reduce((acc: any, key: string) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

interface I18nContextValue {
  t: (key: string) => string;
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const I18nContext = createContext<I18nContextValue>({
  t: (k: string) => k,
  locale: 'en',
  setLocale: () => {},
});

export function I18nProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale?: Locale }) {
  const [locale, setLocale] = useState<Locale>(initialLocale ?? 'en');

  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('locale') : null;
      if (saved === 'en' || saved === 'ja') {
        setLocale(saved);
        return;
      }
      const nav = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en';
      if (nav.startsWith('ja')) setLocale('ja');
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') localStorage.setItem('locale', locale);
    } catch {}
  }, [locale]);

  const t = useMemo(() => {
    return (key: string) => {
      const dict = resources[locale] || resources.en;
      const val = getByPath(dict, key);
      return typeof val === 'string' ? val : key;
    };
  }, [locale]);

  const value = useMemo(() => ({ t, locale, setLocale }), [t, locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

