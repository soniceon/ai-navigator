import { useRouter } from 'next/router';

const siteName = 'SoniceAI';
const langs = [
  { code: 'zh', label: '简体中文' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'ru', label: 'Русский' },
];

const copyright = {
  zh: '版权所有',
  en: 'All rights reserved.',
  ja: '全著作権所有。',
  ko: '판권 소유.',
  de: 'Alle Rechte vorbehalten.',
  fr: 'Tous droits réservés.',
  es: 'Todos los derechos reservados.',
  ru: 'Все права защищены.'
} as const;

type LangKey = keyof typeof copyright;

export default function Footer() {
  const router = useRouter();
  const lang = router.locale || 'en';
  const langKey = (['zh','en','ja','ko','de','fr','es','ru'].includes(lang) ? lang : 'en') as LangKey;

  const handleChangeLang = (code: string) => {
    if (code !== lang) {
      router.push(router.asPath, router.asPath, { locale: code });
    }
  };

  return (
    <footer key={lang} className="bg-[#ede9fe] dark:bg-[#232136] border-t border-gray-200 dark:border-gray-800 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-2">
        <div className="text-2xl font-bold text-purple-700">{siteName}</div>
        <div className="flex flex-wrap justify-center gap-3 text-gray-500 text-sm mb-1">
          {langs.map(l => (
            <span
              key={l.code}
              className={`hover:text-purple-700 cursor-pointer underline-offset-2 transition font-bold ${lang === l.code ? 'text-purple-700 dark:text-purple-300 underline' : ''}`}
              onClick={() => handleChangeLang(l.code)}
            >
              {l.label}
            </span>
          ))}
        </div>
        <div className="text-gray-400 dark:text-gray-500 text-xs">© 2025 {siteName}. {copyright[langKey]}</div>
      </div>
    </footer>
  );
} 