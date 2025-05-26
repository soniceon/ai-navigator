import { useTranslation } from 'next-i18next';
import { useState } from 'react';

const mockAds = [
  { tool: 'ChatGPT', url: 'https://chat.openai.com/ad', balance: 100, status: '投放中' },
  { tool: 'Midjourney', url: 'https://midjourney.com/ad', balance: 0, status: '已停止' },
];

export default function AdsPage() {
  const { t } = useTranslation('common');
  const [ads] = useState(mockAds);
  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8">
      <div className="flex gap-4 mb-6">
        <button className="px-4 py-2 bg-purple-600 text-white rounded">{t('create_new_ad')}</button>
      </div>
      <div className="bg-white dark:bg-[#232136] rounded-2xl shadow p-6">
        <div className="font-bold text-lg mb-4 text-gray-900 dark:text-white">{t('my_ads')}</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-500 dark:text-gray-300">
                <th className="px-3 py-2">{t('tool')}</th>
                <th className="px-3 py-2">{t('ad_url')}</th>
                <th className="px-3 py-2">{t('ad_balance')}</th>
                <th className="px-3 py-2">{t('status')}</th>
                <th className="px-3 py-2">{t('action')}</th>
              </tr>
            </thead>
            <tbody>
              {ads.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">{t('no_ads')}</td></tr>
              ) : ads.map((row, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-3 py-2 font-bold text-gray-900 dark:text-white">{row.tool}</td>
                  <td className="px-3 py-2"><a href={row.url} className="text-purple-600 underline" target="_blank" rel="noopener noreferrer">{row.url}</a></td>
                  <td className="px-3 py-2">{row.balance}</td>
                  <td className="px-3 py-2">{row.status}</td>
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