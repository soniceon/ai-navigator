import { AiTool } from '@/types/aiTool';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useFavoriteStore } from '@/store/favoriteStore';
import Link from 'next/link';

export default function ToolCard({ tool }: { tool: AiTool }) {
  const router = useRouter();
  const lang = router.locale || 'en';
  const { t } = useTranslation('common');
  const langKey = (['zh','en','ja','ko','de','fr','es','ru'].includes(lang) ? lang : 'en') as keyof typeof tool.name;
  const isFavorite = useFavoriteStore(state => state.isFavorite(tool.id));
  const toggleFavorite = useFavoriteStore(state => state.toggleFavorite);
  return (
    <Link href={`/tools/${tool.id}`} className="block bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col items-start border border-purple-500/40 relative min-w-[180px] max-w-[210px] h-[120px] group cursor-pointer">
      <div className="flex items-center gap-2 mb-0.5">
        <span className="text-xl">{tool.icon}</span>
        <span className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{tool.name[langKey]}</span>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-300 mb-1 line-clamp-1">{tool.desc[langKey]}</div>
      <div className="flex flex-wrap gap-1 mt-auto mb-1">
        {tool.tags.slice(0,2).map(tag => {
          const key = 'tag_' + tag.toLowerCase().replace(/[^a-z0-9]/g, '');
          const localized = t(key) !== key ? t(key) : tag;
          return (
            <span key={tag} className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 px-2 py-0.5 rounded text-xs">{localized}</span>
          );
        })}
      </div>
      <button
        onClick={e => { e.preventDefault(); e.stopPropagation(); toggleFavorite(tool.id); }}
        aria-label={isFavorite ? t('unfavorite') : t('favorite')}
        className="absolute bottom-1 right-2 text-pink-500 text-lg transition-all duration-150 hover:scale-125 focus:outline-none"
        style={{ cursor: 'pointer' }}
      >
        {isFavorite ? '♥' : '♡'}
      </button>
    </Link>
  );
} 