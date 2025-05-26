import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

interface LanguageSwitcherProps {
  onClose: () => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ onClose }) => {
  const router = useRouter();
  const { i18n } = useTranslation();
  const { pathname, asPath, query } = router;
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ];
  
  const handleLanguageChange = async (locale: string) => {
    await router.push({ pathname, query }, asPath, { locale });
    i18n.changeLanguage(locale);
    onClose();
  };
  
  return (
    <div
      ref={menuRef}
      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 py-1 z-50 animate-fade-in"
    >
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => handleLanguageChange(language.code)}
          className={`flex items-center w-full px-4 py-2 text-sm ${
            router.locale === language.code
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <span className="mr-2">{language.flag}</span>
          <span>{language.name}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;