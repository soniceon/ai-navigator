import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import Link from 'next/link';
import { useSearch } from '@/contexts/SearchContext';
import { useRouter } from 'next/router';
import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import Cookies from 'js-cookie';

const SIDEBAR_WIDTH = 80; // 侧边栏展开宽度(px)

function Logo() {
  return (
    <svg viewBox="0 0 40 40" width={40} height={40} className="rounded-full border bg-white" style={{display:'block'}}>
      <circle cx="20" cy="20" r="19" fill="#fff" stroke="#8b5cf6" strokeWidth="2" />
      <circle cx="20" cy="20" r="18" fill="#fff" />
      <path d="M20,2 a18,18 0 0,1 0,36 a9,9 0 0,0 0,-18 a9,9 0 0,1 0,-18" fill="#22223b" />
      <circle cx="20" cy="10" r="4" fill="#e0f2fe" stroke="#06b6d4" strokeWidth="1.5" />
      <circle cx="20" cy="30" r="4" fill="#22223b" stroke="#8b5cf6" strokeWidth="1.5" />
    </svg>
  );
}

// 重构菜单数据结构
const rankingMenu = [
  { icon: '🏱', key: 'menu_ranking', descKey: 'menu_ranking_desc', link: '/rankings' },
  { icon: '🏨', key: 'menu_category_ranking', descKey: 'menu_category_ranking_desc', link: '/rankings/categories' },
  { icon: '🍖', key: 'menu_region_ranking', descKey: 'menu_region_ranking_desc', link: '/rankings/region' },
  { icon: '👐', key: 'menu_channel_ranking', descKey: 'menu_channel_ranking_desc', link: '/rankings/channel' },
  { icon: '🧵', key: 'menu_revenue_ranking', descKey: 'menu_revenue_ranking_desc', link: '/rankings/revenue' },
];
const categoryMenu = [
  { icon: '✔', key: 'menu_new_arrivals', descKey: 'menu_new_arrivals_desc', link: '/categories/new' },
  { icon: '📑', key: 'menu_most_saved', descKey: 'menu_most_saved_desc', link: '/categories/saved' },
  { icon: '🔥', key: 'menu_top_traffic', descKey: 'menu_top_traffic_desc', link: '/categories/top' },
  { icon: '🫫', key: 'menu_ai_apps', descKey: 'menu_ai_apps_desc', link: '/categories/apps' },
  { icon: '🐓', key: 'menu_ai_plugins', descKey: 'menu_ai_plugins_desc', link: '/categories/plugins' },
  { icon: '🧻', key: 'menu_gpts', descKey: 'menu_gpts_desc', link: '/categories/gpts' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation('common');
  type LangKey = 'zh' | 'en' | 'ja' | 'ko' | 'de' | 'fr' | 'es' | 'ru';
  const lang = (i18n.language as LangKey) || 'zh';
  const { keyword, setKeyword } = useSearch();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rankingDropdown, setRankingDropdown] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const rankingTimeout = useRef<NodeJS.Timeout | null>(null);
  const categoryTimeout = useRef<NodeJS.Timeout | null>(null);
  const { logout, isLoggedIn, user } = useAuth();
  const [profileDropdown, setProfileDropdown] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    localStorage.clear();
    if (typeof logout === 'function') logout();
    window.location.href = '/login'; // 强制刷新，彻底同步状态
  };

  // 搜索并跳转首页
  const handleSearch = () => {
    if (router.pathname !== '/') {
      router.push('/').then(() => {
        setTimeout(() => {
          const el = document.getElementById('toolgrid-anchor');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      });
    } else {
      const el = document.getElementById('toolgrid-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 判断当前高亮
  const isActive = (href: string) => router.pathname === href;

  const handleRankingEnter = () => {
    if (rankingTimeout.current) clearTimeout(rankingTimeout.current);
    setRankingDropdown(true);
  };
  const handleRankingLeave = () => {
    rankingTimeout.current = setTimeout(() => setRankingDropdown(false), 300);
  };
  const handleCategoryEnter = () => {
    if (categoryTimeout.current) clearTimeout(categoryTimeout.current);
    setCategoryDropdown(true);
  };
  const handleCategoryLeave = () => {
    categoryTimeout.current = setTimeout(() => setCategoryDropdown(false), 300);
  };

  return (
    <nav key={i18n.language} className="w-full bg-white dark:bg-gray-900 shadow flex items-center px-4 md:px-8" style={{ minHeight: 72 }}>
      <div className="flex items-center gap-2 min-w-[180px]" style={{ marginLeft: SIDEBAR_WIDTH }}>
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-bold text-2xl text-purple-700 ml-1">SoniceAI</span>
        </Link>
      </div>
      {/* 页面导航 居中 */}
      <div className="flex-1 flex justify-center">
        <div className="hidden md:flex gap-6 text-gray-700 dark:text-gray-200 font-medium items-center">
          {/* 排行榜下拉 */}
          <div className="relative"
            onMouseEnter={handleRankingEnter}
            onMouseLeave={handleRankingLeave}
          >
            <button className={`flex items-center gap-1 text-base hover:text-purple-600 ${isActive('/rankings') ? 'text-purple-600 font-bold' : ''}`}> <span className="text-xl">🏱</span>{t('navbar_rankings')}</button>
            {rankingDropdown && (
              <div className="absolute left-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 shadow-xl rounded-2xl z-30"
                onMouseEnter={handleRankingEnter}
                onMouseLeave={handleRankingLeave}
              >
                <div className="py-2">
                  {rankingMenu.map(item => (
                    <Link key={item.link} href={item.link} className="flex items-start gap-3 px-5 py-3 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-xl">
                      <span className="text-2xl mt-1">{item.icon}</span>
                      <div>
                        <div className="font-bold text-base">{t(item.key)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{t(item.descKey)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* 分类下拉 */}
          <div className="relative"
            onMouseEnter={handleCategoryEnter}
            onMouseLeave={handleCategoryLeave}
          >
            <button className={`flex items-center gap-1 text-base hover:text-purple-600 ${isActive('/categories') ? 'text-purple-600 font-bold' : ''}`}>
              <span className="text-xl">🏨</span>{t('navbar_categories')}
            </button>
            {categoryDropdown && (
              <div className="absolute left-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 shadow-xl rounded-2xl z-30"
                onMouseEnter={handleCategoryEnter}
                onMouseLeave={handleCategoryLeave}
              >
                <div className="py-2">
                  {categoryMenu.map(item => (
                    <Link key={item.link} href={item.link} className="flex items-start gap-3 px-5 py-3 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-xl">
                      <span className="text-2xl mt-1">{item.icon}</span>
                      <div>
                        <div className="font-bold text-base">{t(item.key)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{t(item.descKey)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link href="/tools" className={`hover:text-purple-600 flex items-center gap-1 text-base ${isActive('/tools') ? 'text-purple-600 font-bold' : ''}`}><span className="text-xl">🛠️</span>{t('navbar_tools')}</Link>
          <Link href="/featured" className={`hover:text-purple-600 flex items-center gap-1 text-base ${isActive('/featured') ? 'text-purple-600 font-bold' : ''}`}><span className="text-xl">⭐</span>{t('navbar_featured')}</Link>
        </div>
      </div>
      {/* 右侧搜索/主题/语言 */}
      <div className="flex items-center gap-2 min-w-[320px] justify-end ml-auto" style={{ marginRight: 24 }}>
        <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
          <input
            className="px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 outline-none"
            placeholder={t('navbar_search_placeholder')}
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
          />
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 flex items-center" onClick={handleSearch}>
            <span className="material-icons text-base">{t('navbar_search')}</span>
          </button>
        </div>
        <ThemeToggle />
        <LanguageSwitcher />
        {/* 用户中心/登录注册/看板 */}
        {isLoggedIn && user ? (
          <Link href="/dashboard" className="ml-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">{t('navbar_dashboard')}</Link>
        ) : (
          <>
            <Link href="/login" className="ml-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">{t('navbar_login')}</Link>
            <Link href="/register" className="ml-2 px-4 py-2 border border-purple-600 text-purple-600 rounded hover:bg-purple-50">{t('navbar_register')}</Link>
          </>
        )}
      </div>
    </nav>
  );
}