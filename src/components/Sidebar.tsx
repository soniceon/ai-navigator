import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const categories = [
  { type: 'chatbot', icon: "💬", tKey: 'sidebar_chatbot', color: "text-cyan-500" },
  { type: 'image', icon: "🖼️", tKey: 'sidebar_image', color: "text-orange-400" },
  { type: 'coding', icon: "💻", tKey: 'sidebar_coding', color: "text-blue-500" },
  { type: 'productivity', icon: "📝", tKey: 'sidebar_productivity', color: "text-orange-500" },
  { type: 'design', icon: "🎨", tKey: 'sidebar_design', color: "text-gray-700" },
  { type: 'writing', icon: "✍️", tKey: 'sidebar_writing', color: "text-green-500" },
  { type: 'media', icon: "🎬", tKey: 'sidebar_media', color: "text-pink-500" },
  { type: 'marketing', icon: "📢", tKey: 'sidebar_marketing', color: "text-red-500" },
  { type: 'security', icon: "🔒", tKey: 'sidebar_security', color: "text-black" },
];

import Link from 'next/link';

export default function Sidebar() {
  const { t, ready } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale || 'en';
  const [hover, setHover] = useState(false);
  
  useEffect(() => {
    // 只在客户端调试输出
    console.log('Sidebar.tsx 当前语言:', locale, 'sidebar_tools:', t('sidebar_tools'));
  }, [locale, t]);

  if (!ready) {
    // loading 占位，防止页面结构丢失
    return (
      <aside className="hidden md:flex fixed top-20 left-0 z-40 h-[calc(100vh-2rem)] w-24 bg-white dark:bg-gray-900 rounded-r-2xl border-r border-gray-100 dark:border-gray-800 animate-pulse" />
    );
  }

  return (
    <aside
      key={locale}
      className="hidden md:flex fixed top-20 left-0 z-40 h-[calc(100vh-2rem)] w-24 hover:w-64 bg-white shadow-lg rounded-r-2xl flex-col py-2 gap-1 border-r border-gray-100 dark:bg-gray-900 dark:border-gray-800 group transition-all duration-200 overflow-y-auto"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {categories.map((cat, idx) => (
        <Link
          key={`${cat.type}-${locale}`}
          href={`/#${cat.type}`}
          className="flex items-center gap-2 px-5 py-1.5 font-medium transition rounded-l-full group"
        >
          <span className={`text-lg ${cat.color}`}>{cat.icon}</span>
          <span
            className={`text-sm text-gray-700 dark:text-gray-200 transition-all duration-200 truncate
              ${hover ? 'opacity-100 ml-2' : 'opacity-0 ml-[-8px] w-0 overflow-hidden'}
            `}
            style={{ minWidth: hover ? 60 : 0 }}
          >
            {t(cat.tKey)}
          </span>
        </Link>
      ))}
    </aside>
  );
} 