import { createContext, useContext, useState, useEffect } from 'react';
import { LANGS } from '@/locales';
import { useRouter } from 'next/router';

const defaultLang = 'en';

export const LanguageContext = createContext({
  lang: defaultLang,
  setLang: (l: string) => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [lang, setLang] = useState(router.locale || defaultLang);
  
  // Keep lang in sync with router.locale
  useEffect(() => {
    if (router.locale && router.locale !== lang) {
      setLang(router.locale);
    }
  }, [router.locale]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
} 