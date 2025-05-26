import { useTranslation } from 'next-i18next';
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
  { code: 'ru', label: 'Русский' }
];

type LangKey = 'zh' | 'en' | 'ja' | 'ko' | 'de' | 'fr' | 'es' | 'ru';

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

export default function Footer() {
  const { t } = useTranslation();
  const router = useRouter();
  const lang = router.locale || 'en';
  const langKey = (['zh', 'en', 'ja', 'ko', 'de', 'fr', 'es', 'ru'].includes(lang) ? lang : 'en') as LangKey;
  const copyright = {
    zh: '版权所有',
    en: t('auto_all_rights_reserved_1efc10'),
    ja: '全著作権所有。',
    ko: '판권 소유.',
    de: t('auto_alle_rechte_vorbehalten_e642c4'),
    fr: 'Tous droits réservés.',
    es: t('auto_todos_los_derechos_reservados_5577b0'),
    ru: 'Все права защищены.'
  } as const;
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
              {langLabels[lang] && langLabels[lang][l.code] ? langLabels[lang][l.code] : l.label}
            </span>
          ))}
        </div>
        <div className="text-gray-400 dark:text-gray-500 text-xs">© 2025 {siteName}. {copyright[langKey]}</div>
      </div>
    </footer>
  );
}