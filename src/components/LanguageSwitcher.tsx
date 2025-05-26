import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

// 国际化 label
const langLabels: Record<string, Record<string, string>> = {
  zh: { zh: '简体中文', en: '英文', ja: '日语', ko: '韩语', de: '德语', fr: '法语', es: '西班牙语', ru: '俄语' },
  en: { zh: 'Chinese', en: 'English', ja: 'Japanese', ko: 'Korean', de: 'German', fr: 'French', es: 'Spanish', ru: 'Russian' },
  ja: { zh: '中国語', en: '英語', ja: '日本語', ko: '韓国語', de: 'ドイツ語', fr: 'フランス語', es: 'スペイン語', ru: 'ロシア語' },
  ko: { zh: '중국어', en: '영어', ja: '일본어', ko: '한국어', de: '독일어', fr: '프랑스어', es: '스페인어', ru: '러시아어' },
  de: { zh: 'Chinesisch', en: 'Englisch', ja: 'Japanisch', ko: 'Koreanisch', de: 'Deutsch', fr: 'Französisch', es: 'Spanisch', ru: 'Russisch' },
  fr: { zh: 'Chinois', en: 'Anglais', ja: 'Japonais', ko: 'Coréen', de: 'Allemand', fr: 'Français', es: 'Espagnol', ru: 'Russe' },
  es: { zh: 'Chino', en: 'Inglés', ja: 'Japonés', ko: 'Coreano', de: 'Alemán', fr: 'Francés', es: 'Español', ru: 'Ruso' },
  ru: { zh: 'Китайский', en: 'Английский', ja: 'Японский', ko: 'Корейский', de: 'Немецкий', fr: 'Французский', es: 'Испанский', ru: 'Русский' },
};

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
      const { pathname, asPath, query } = router;
      await router.push({ pathname, query }, asPath, { locale: newLang });
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
        <option key={l.code} value={l.code}>
          {langLabels[currentLang] && langLabels[currentLang][l.code] ? langLabels[currentLang][l.code] : l.label}
        </option>
      ))}
    </select>
  );
} 