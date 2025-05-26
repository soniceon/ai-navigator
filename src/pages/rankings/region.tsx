import { aiTools } from '@/data/aiTools';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
const regions = [
  { key: 'america', icon: '🌎' },
  { key: 'europe', icon: '🌍' },
  { key: 'asia', icon: '🌏' },
  { key: 'other', icon: '🌐' },
];
type Tool = typeof aiTools[number];
// 随机分配工具到地区
function getRegionTools(regionKey: string, allTools: Tool[]): Tool[] {
  const total = allTools.length;
  if (regionKey === 'america') return allTools.slice(0, Math.ceil(total/4));
  if (regionKey === 'europe') return allTools.slice(Math.ceil(total/4), Math.ceil(total/2));
  if (regionKey === 'asia') return allTools.slice(Math.ceil(total/2), Math.ceil(total*3/4));
  return allTools.slice(Math.ceil(total*3/4));
}
export default function RegionRanking() {
  const { t, i18n, ready } = useTranslation('common');
  const router = useRouter();
  const lang = router.locale || i18n.language || 'en';
  if (!ready) return null; // 语言包未加载时不渲染，防止 hydration mismatch
  return (
    <div key={i18n.language} className="py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-center">{t('region_ranking')}</h1>
      {regions.map(region => {
        const tools = getRegionTools(region.key, aiTools);
        if (!tools.length) return null;
        return (
          <div key={region.key} className="mb-10">
            <div className="flex items-center gap-2 mb-4 text-xl font-semibold">
              <span>{region.icon}</span>
              <span>{t(`region_${region.key}`)}</span>
              <span className="text-xs text-gray-400">({tools.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tools.map((tool: Tool, idx: number) => (
                <div key={tool.id} className="p-5 rounded-xl bg-white dark:bg-gray-800 shadow flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-lg font-bold">
                    <span>{tool.icon}</span>
                    <span>{tool.name[lang] || tool.name.en}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">{tool.desc[lang] || tool.desc.en}</div>
                  <div className="text-xs text-gray-400">⭐ {tool.rating} | 👥 {tool.users}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
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