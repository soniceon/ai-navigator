import { useTranslation } from 'next-i18next';
import { useState } from 'react';

const mockFavorites = [
  { name: 'ChatGPT', url: 'https://chat.openai.com', type: '聊天', date: '2024-05-01' },
  { name: 'Midjourney', url: 'https://midjourney.com', type: '绘画', date: '2024-05-02' },
];

export default function FavoritesPage() {
  const { t } = useTranslation('common');
  const [favorites] = useState(mockFavorites);
  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8">
      <div className="bg-white dark:bg-[#232136] rounded-2xl shadow p-6">
        <div className="font-bold text-lg mb-4 text-gray-900 dark:text-white">{t('my_favorites')}</div>
        <div className="overflow-x-auto">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center py-16">
              <img src="/empty-fav.svg" alt="empty" className="w-32 h-32 mb-4 opacity-70" />
              <div className="text-gray-400 mb-2">{t('no_favorites')}</div>
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-500 dark:text-gray-300">
                  <th className="px-3 py-2">{t('tool')}</th>
                  <th className="px-3 py-2">{t('website')}</th>
                  <th className="px-3 py-2">{t('type')}</th>
                  <th className="px-3 py-2">{t('date')}</th>
                  <th className="px-3 py-2">{t('action')}</th>
                </tr>
              </thead>
              <tbody>
                {favorites.map((row, i) => (
                  <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="px-3 py-2 font-bold text-gray-900 dark:text-white">{row.name}</td>
                    <td className="px-3 py-2"><a href={row.url} className="text-purple-600 underline" target="_blank" rel="noopener noreferrer">{row.url}</a></td>
                    <td className="px-3 py-2">{row.type}</td>
                    <td className="px-3 py-2">{row.date}</td>
                    <td className="px-3 py-2"><button className="text-xs text-red-500 hover:underline">{t('remove')}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
} 