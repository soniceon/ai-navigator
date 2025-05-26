import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const langs = [
  { code: 'zh', label: '中' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: '日' },
  { code: 'ko', label: '韩' },
  { code: 'de', label: 'DE' },
  { code: 'fr', label: 'FR' },
  { code: 'es', label: 'ES' },
  { code: 'ru', label: 'RU' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const currentLang = router.locale || i18n.language || 'en';

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    if (router.locale !== newLang) {
      await router.push(router.asPath, router.asPath, { locale: newLang });
      i18n.changeLanguage(newLang);
    }
  };

  return (
    <select
      value={currentLang}
      onChange={handleChange}
      className="w-16 h-9 rounded-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm font-bold text-center text-gray-900 dark:text-white"
      title="切换语言"
    >
      {langs.map(l => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  );
} 