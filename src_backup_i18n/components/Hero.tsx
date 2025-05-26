import { useRef, useState, useEffect } from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

export default function Hero() {
  const { keyword, setKeyword } = useSearch();
  const { t, i18n } = useTranslation('common');
  const [showDropdown, setShowDropdown] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [heroMenu, setHeroMenu] = useState([
    { key: 'menu_ranking', link: '/rankings', icon: '📊' },
    { key: 'menu_new_arrivals', link: '/categories/new', icon: '✨' },
    { key: 'menu_most_saved', link: '/categories/saved', icon: '💾' },
    { key: 'menu_top_traffic', link: '/categories/top', icon: '🔥' },
    { key: 'menu_ai_apps', link: '/categories/apps', icon: '📱' },
    { key: 'menu_ai_plugins', link: '/categories/plugins', icon: '🧩' },
    { key: 'menu_gpts', link: '/categories/gpts', icon: '🤖' },
    { key: 'menu_category_ranking', link: '/rankings/categories', icon: '📂' },
    { key: 'menu_region_ranking', link: '/rankings/region', icon: '🌍' },
    { key: 'menu_channel_ranking', link: '/rankings/channel', icon: '🔗' },
    { key: 'menu_revenue_ranking', link: '/rankings/revenue', icon: '💰' }
  ]);
  
  // 监听语言变化，强制重新渲染并更新菜单数据
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
    
    // 重新设置菜单，确保翻译更新
    setHeroMenu([
      { key: 'menu_ranking', link: '/rankings', icon: '📊' },
      { key: 'menu_new_arrivals', link: '/categories/new', icon: '✨' },
      { key: 'menu_most_saved', link: '/categories/saved', icon: '💾' },
      { key: 'menu_top_traffic', link: '/categories/top', icon: '🔥' },
      { key: 'menu_ai_apps', link: '/categories/apps', icon: '📱' },
      { key: 'menu_ai_plugins', link: '/categories/plugins', icon: '🧩' },
      { key: 'menu_gpts', link: '/categories/gpts', icon: '🤖' },
      { key: 'menu_category_ranking', link: '/rankings/categories', icon: '📂' },
      { key: 'menu_region_ranking', link: '/rankings/region', icon: '🌍' },
      { key: 'menu_channel_ranking', link: '/rankings/channel', icon: '🔗' },
      { key: 'menu_revenue_ranking', link: '/rankings/revenue', icon: '💰' }
    ]);
  }, [i18n.language]);
  
  // 滚动到 ToolGrid
  const handleSearch = () => {
    const el = document.getElementById('toolgrid-anchor');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div key={i18n.language} className="w-full bg-[#ede9fe] dark:bg-[#232136] py-16">
      <section className="max-w-7xl mx-auto text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight">{t('hero_title')}</h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-8 max-w-2xl mx-auto">
          {t('hero_desc')}
        </p>
        <div className="flex justify-center mb-8 relative">
          <input
            className="rounded-l-lg px-4 py-3 border-0 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none w-80 max-w-full shadow"
            placeholder={t('hero_placeholder')}
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            key={`hero-input-${i18n.language}-${forceUpdate}`}
          />
          <button
            className="rounded-r-lg bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 font-semibold transition shadow"
            onClick={handleSearch}
          >
            {t('hero_search')}
          </button>
          
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 text-left max-h-80 overflow-y-auto" key={`dropdown-${i18n.language}-${forceUpdate}`}>
              {heroMenu.map(item => (
                <Link 
                  key={`${item.key}-${i18n.language}-${forceUpdate}`} 
                  href={item.link} 
                  className="flex items-center gap-2 px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-900"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{t(item.key)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-purple-700 dark:text-purple-300 text-base font-medium">
          <span className="flex items-center gap-2" key={`stats-tools-${i18n.language}-${forceUpdate}`}><span className="text-xl">🛠️</span> {t('hero_stats_tools')}</span>
          <span className="flex items-center gap-2" key={`stats-cats-${i18n.language}-${forceUpdate}`}><span className="text-xl">📚</span> {t('hero_stats_cats')}</span>
          <span className="flex items-center gap-2" key={`stats-users-${i18n.language}-${forceUpdate}`}><span className="text-xl">👥</span> {t('hero_stats_users')}</span>
        </div>
      </section>
    </div>
  );
} 