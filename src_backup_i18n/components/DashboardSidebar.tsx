import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const menu = [
  { key: 'tools', icon: '🛠️', tKey: 'sidebar_tools', path: '/dashboard/tools' },
  { key: 'ads', icon: '📢', tKey: 'sidebar_ads', path: '/dashboard/ads' },
  { key: 'posts', icon: '📝', tKey: 'sidebar_posts', path: '/dashboard/posts' },
  { key: 'gpts', icon: '🧊', tKey: 'sidebar_gpts', path: '/dashboard/gpts' },
  { key: 'listening', icon: '👂', tKey: 'sidebar_listening', path: '/dashboard/listening' },
  { key: 'favorites', icon: '⭐', tKey: 'sidebar_favorites', path: '/dashboard/favorites' },
  { key: 'orders', icon: '🧾', tKey: 'sidebar_orders', path: '/dashboard/orders' },
];

export default function DashboardSidebar() {
  const { t, i18n, ready } = useTranslation('common');
  if (!ready) return null;
  const [forceUpdate, setForceUpdate] = useState(0);
  useEffect(() => {
    i18n.reloadResources(i18n.language, ['common']);
  }, [i18n.language]);
  console.log('DashboardSidebar.tsx 当前语言:', i18n.language, 'sidebar_tools:', t('sidebar_tools'));
  const router = useRouter();
  return (
    <aside key={i18n.language} className="flex flex-col w-56 min-h-screen bg-[#232136] border-r border-gray-900 shadow-xl py-8 px-3">
      <nav className="flex flex-col gap-2">
        {menu.map(item => (
          <Link
            key={item.key}
            href={item.path}
            className={`flex items-center gap-4 px-5 py-3 rounded-xl font-semibold text-gray-200 hover:bg-purple-800 hover:text-purple-200 transition-all text-lg duration-200 group ${router.asPath.startsWith(item.path) ? 'bg-gradient-to-r from-purple-900 to-purple-700 text-white shadow-lg' : ''}`}
          >
            <span className={`text-2xl transition ${router.asPath.startsWith(item.path) ? 'text-yellow-300 drop-shadow' : 'group-hover:text-purple-300'}`}>{item.icon}</span>
            <span>{t(item.tKey)}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
} 