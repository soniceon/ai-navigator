import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';

const mockPosts = [
  { title: 'post_ai_tools_recommend', url: 'https://blog.ai.com/post1', type: 'type_post', date: '2024-05-01', status: 'status_published' },
  { title: 'post_external_promotion', url: 'https://blog.ai.com/link1', type: 'type_link', date: '2024-05-02', status: 'status_reviewing' },
];

export default function PostsPage() {
  const { t } = useTranslation('common');
  const [posts] = useState(mockPosts);
  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8">
      <div className="flex gap-4 mb-6">
        <button className="px-4 py-2 bg-purple-600 text-white rounded">{t('create_new_post')}</button>
        <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded">{t('create_new_link')}</button>
      </div>
      <div className="bg-white dark:bg-[#232136] rounded-2xl shadow p-6">
        <div className="font-bold text-lg mb-4 text-gray-900 dark:text-white">{t('my_posts_links')}</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-500 dark:text-gray-300">
                <th className="px-3 py-2">{t('title')}</th>
                <th className="px-3 py-2">{t('url')}</th>
                <th className="px-3 py-2">{t('type')}</th>
                <th className="px-3 py-2">{t('date')}</th>
                <th className="px-3 py-2">{t('status')}</th>
                <th className="px-3 py-2">{t('action')}</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">{t('no_posts')}</td></tr>
              ) : posts.map((row, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-3 py-2 font-bold text-gray-900 dark:text-white">{t(row.title)}</td>
                  <td className="px-3 py-2"><a href={row.url} className="text-purple-600 underline" target="_blank" rel="noopener noreferrer">{row.url}</a></td>
                  <td className="px-3 py-2">{t(row.type)}</td>
                  <td className="px-3 py-2">{row.date}</td>
                  <td className="px-3 py-2">{t(row.status)}</td>
                  <td className="px-3 py-2"><button className="text-xs text-purple-600 hover:underline">{t('edit')}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
}; 