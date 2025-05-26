import { aiTools } from '@/data/aiTools';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
type Tool = typeof aiTools[number];
type LangKey = keyof typeof aiTools[0]['name'];
export default function MostSaved() {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const lang = router.locale || i18n.language || 'en';
  const langKey: LangKey = (Object.keys(aiTools[0].name).includes(lang) ? lang : 'en') as LangKey;
  // 更智能地解析用户数
  const parseUsers = (u: string) => {
    if (!u) return 0;
    const lower = u.toLowerCase();
    if (lower.includes('m')) return parseInt(lower) * 1000000;
    if (lower.includes('k')) return parseInt(lower) * 1000;
    return parseInt(lower) || 0;
  };
  const sorted = [...aiTools].sort((a, b) => parseUsers(b.users) - parseUsers(a.users)).slice(0, 20);
  return (
    <div className="py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-center">{t('most_saved')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sorted.map((tool: Tool, idx: number) => (
          <div key={tool.id} className="p-5 rounded-xl bg-white dark:bg-gray-800 shadow flex flex-col gap-2">
            <div className="flex items-center gap-2 text-lg font-bold">
              <span>{tool.icon}</span>
              <span>{tool.name[langKey] || tool.name.en}</span>
            </div>
            <div className="text-xs text-gray-500 mb-1">{tool.desc[langKey] || tool.desc.en}</div>
            <div className="text-xs text-gray-400">⭐ {tool.rating} | 👥 {tool.users}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 