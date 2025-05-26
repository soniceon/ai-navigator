import { aiTools } from '@/data/aiTools';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export default function RankingsPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale || 'en';
  const langKey = (['zh','en','ja','ko','de','fr','es','ru'].includes(locale) ? locale : 'en') as keyof typeof aiTools[0]['name'];
  const sorted = [...aiTools].sort((a, b) => b.rating - a.rating).slice(0, 10);
  return (
    <div className="max-w-7xl mx-auto w-full px-4 flex flex-col items-center" style={{background:'#181A20'}}>
      <h1 className="text-4xl font-extrabold mb-12 mt-14 text-center text-white tracking-tight">
        {t('ai_tool_rankings')}
      </h1>
      {sorted.length === 0 ? (
        <div className="text-gray-400 mb-8 text-center">{t('no_ranking_data')}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 w-full justify-items-center">
          {sorted.map((tool, idx) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.id}`}
              className="relative flex flex-row items-center min-h-[120px] max-h-[160px] w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-200 p-4 gap-4 hover:scale-[1.03]"
              style={{ boxShadow: '0 2px 12px 0 #23294622' }}
            >
              {/* 排名数字左上角彩带样式 */}
              <span className="absolute left-0 top-0 w-10 h-6 flex items-center justify-center text-white text-sm font-bold rounded-tr-lg rounded-bl-lg shadow-md"
                style={{
                  background: 'linear-gradient(90deg, #3E54A3 60%, #5B8FB9 100%)',
                  boxShadow: '0 2px 6px 0 #23294633',
                  zIndex: 10
                }}
              >
                {idx+1}
              </span>
              {/* 图标 */}
              <span className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue-400 mr-3 shadow-sm overflow-hidden relative">
                {tool.iconUrl ? (
                  <>
                    <img
                      src={tool.iconUrl}
                      alt={tool.name[langKey]}
                      className="w-10 h-10 object-contain absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                      onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.querySelector('.emoji-fallback')?.classList.remove('hidden'); }}
                    />
                    <span className="emoji-fallback text-2xl text-white hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">{tool.icon}</span>
                  </>
                ) : (
                  <span className="text-2xl text-white">{tool.icon}</span>
                )}
              </span>
              {/* 右侧内容 */}
              <div className="flex flex-col flex-1 min-w-0">
                {/* 工具名和简介 */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="font-bold text-base text-gray-900 dark:text-white break-words max-w-full leading-snug whitespace-pre-line">{tool.name[langKey]}</div>
                  <span className="text-xs text-yellow-500 font-bold">★{tool.rating}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-300">👥{tool.users}</span>
                </div>
                <div className="text-gray-700 dark:text-gray-200 text-sm mb-1 line-clamp-2 min-h-[32px] break-all max-w-[320px]">{tool.desc[langKey]}</div>
                {/* 标签 */}
                <div className="flex flex-wrap gap-1 mt-auto">
                  {tool.tags.map(tag => {
                    const key = 'tag_' + tag.toLowerCase().replace(/[^a-z0-9]/g, '');
                    const localized = t(key) !== key ? t(key) : tag;
                    return (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-xs font-medium border border-blue-200 bg-blue-50 text-blue-700 dark:bg-gray-700 dark:text-blue-200 dark:border-blue-700 shadow-sm">{localized}</span>
                    );
                  })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 