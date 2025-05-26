import { aiTools } from '@/data/aiTools';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

export default function RankingsPage() {
  const { lang } = useLanguage();
  const { t, i18n } = useTranslation('common');
  const langKey = (['zh','en','ja','ko','de','fr','es','ru'].includes(lang) ? lang : 'en') as keyof typeof aiTools[0]['name'];
  const sorted = [...aiTools].sort((a, b) => b.rating - a.rating).slice(0, 10);
  return (
    <div className="max-w-7xl mx-auto w-full px-4 flex flex-col items-center" style={{background:'#181A20'}}>
      <h1 className="text-4xl font-extrabold mb-12 mt-14 text-center text-white tracking-tight">
        {t('ai_tool_rankings')}
      </h1>
      {sorted.length === 0 ? (
        <div className="text-gray-400 mb-8 text-center">{t('no_ranking_data')}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-12 w-full justify-items-center">
          {sorted.map((tool, idx) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.id}`}
              className="relative" style={{background:'#232946', borderRadius:'1.5rem', boxShadow:'0 4px 24px 0 #23294644', border:'1px solid #232946', transition:'all .2s', minHeight:360, display:'flex', flexDirection:'column', alignItems:'center', padding:32, width:'100%'}}
            >
              {/* 排名数字主色圆底 */}
              <span className="absolute left-1/2 -translate-x-1/2 -top-8 w-14 h-14 flex items-center justify-center rounded-full text-white text-3xl font-extrabold shadow z-20" style={{background:'#3E54A3'}}>
                {idx+1}
              </span>
              {/* 图标 */}
              <span className="mb-4 mt-10 w-20 h-20 flex items-center justify-center rounded-full text-4xl text-white" style={{background:'#5B8FB9'}}>
                {tool.icon}
              </span>
              {/* 工具名 */}
              <div className="flex items-center gap-2 mb-2 justify-center w-full">
                <div className="font-bold text-xl text-white truncate max-w-[140px] text-center">{tool.name[langKey]}</div>
              </div>
              {/* 简介 */}
              <div className="text-gray-300 text-base mb-4 line-clamp-2 min-h-[44px] text-center w-full">{tool.desc[langKey]}</div>
              {/* 评分和用户数 */}
              <div className="flex gap-3 text-base font-medium mb-3 justify-center w-full">
                <span className="flex items-center gap-1 text-[#3E54A3] bg-[#E5E9F2] px-3 py-0.5 rounded-full text-base"><span>★</span>{tool.rating}</span>
                <span className="flex items-center gap-1 text-[#3E54A3] bg-[#E5E9F2] px-3 py-0.5 rounded-full text-base"><span>👥</span>{tool.users}</span>
              </div>
              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mt-auto justify-center w-full">
                {tool.tags.map(tag => {
                  const key = 'tag_' + tag.toLowerCase().replace(/[^a-z0-9]/g, '');
                  const localized = t(key) !== key ? t(key) : tag;
                  return (
                    <span key={tag} className="px-3 py-0.5 rounded-full text-sm font-normal border border-transparent" style={{background:'#393E6A', color:'#fff'}}>{localized}</span>
                  );
                })}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 