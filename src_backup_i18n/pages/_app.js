import dynamic from 'next/dynamic';
import '../styles/globals.css';
import { appWithTranslation } from 'next-i18next';
import nextI18NextConfig from '../../next-i18next.config.js';
import { AuthProvider } from '../context/AuthContext';
import { SearchProvider } from '../contexts/SearchContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'next-themes';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

// 懒加载最重的组件
const DynamicToolGrid = dynamic(() => import('../components/ToolGrid'));
const DynamicNavbar = dynamic(() => import('../components/Navbar'));
const DynamicFooter = dynamic(() => import('../components/Footer'));

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isHome = router.pathname === '/';
  const { ready, i18n } = useTranslation('common');
  const [languageKey, setLanguageKey] = useState(0);
  
  // 语言变化时，强制整个应用重新渲染
  useEffect(() => {
    if (ready) {
      setLanguageKey(prev => prev + 1);
    }
  }, [i18n.language, ready]);
  
  useEffect(() => {
    if (i18n && router.locale) {
      i18n.changeLanguage(router.locale);
    }
  }, [router.locale]);
  
  if (!ready) return null;
  
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <LanguageProvider>
        <SearchProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#181825] transition-colors" key={`app-${i18n.language}-${languageKey}`}>
              <DynamicNavbar />
              {isHome && <Hero />}
              <div className="flex flex-1">
                <Sidebar key={i18n.language} />
                <div className="flex-1 ml-20 md:ml-56">
                  <main className="max-w-7xl mx-auto w-full px-4">
                    <Component {...pageProps} />
                  </main>
                </div>
              </div>
              <DynamicFooter />
            </div>
          </AuthProvider>
        </SearchProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig); 