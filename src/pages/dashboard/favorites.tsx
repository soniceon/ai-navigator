import DashboardSidebar from '../../components/DashboardSidebar';
import NotImplemented from '../../components/NotImplemented';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useFavoriteStore } from '@/store/favoriteStore';
import { aiTools } from '@/data/aiTools';
import ToolCard from '../../components/ToolCard';
import { useEffect, useState } from 'react';

export default function FavoritesPage() {
  const { t } = useTranslation();
  const favorites = useFavoriteStore(state => state.favorites);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const favoriteTools = aiTools.filter(tool => favorites.includes(tool.id));

  return (
    <div className="flex bg-[#181825] min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-8 max-w-6xl mx-auto flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-8 text-gray-100">{t('my_favorites')}</h2>
        {favoriteTools.length === 0 ? (
          <div className="text-gray-400 text-lg mt-12">{t('no_favorites')}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {favoriteTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  };
} 