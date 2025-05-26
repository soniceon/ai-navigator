import { useTranslation } from 'next-i18next';
import { useState } from 'react';

const mockTools = [
  { name: 'tool_chatgpt', url: 'https://chat.openai.com', type: 'type_chat', date: '2024-05-01', status: 'status_online' },
  { name: 'tool_midjourney', url: 'https://midjourney.com', type: 'type_image', date: '2024-05-02', status: 'status_reviewing' },
];

export default function ToolsPage() {
  const { t } = useTranslation('common');
  const [tools] = useState(mockTools);
  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8">
      <div className="flex gap-4 mb-6">
        <button className="px-4 py-2 bg-purple-600 text-white rounded">{t('submit_new_ai')}</button>
        <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded">{t('update_new_ai')}</button>
      </div>
      <div className="bg-white dark:bg-[#232136] rounded-2xl shadow p-6">
        <div className="font-bold text-lg mb-4 text-gray-900 dark:text-white">{t('my_tools')}</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-500 dark:text-gray-300">
                <th className="px-3 py-2">{t('tool')}</th>
                <th className="px-3 py-2">{t('website')}</th>
                <th className="px-3 py-2">{t('type')}</th>
                <th className="px-3 py-2">{t('date')}</th>
                <th className="px-3 py-2">{t('status')}</th>
                <th className="px-3 py-2">{t('action')}</th>
              </tr>
            </thead>
            <tbody>
              {tools.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">{t('no_tools')}</td></tr>
              ) : tools.map((row, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-3 py-2 font-bold text-gray-900 dark:text-white">{t(row.name)}</td>
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