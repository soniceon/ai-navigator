import { useTranslation } from 'next-i18next';
import { useState } from 'react';

const mockSites = [
  { site: 'notion.so', status: '搜索完成', total: 10276, unlocked: 0 },
  { site: 'openai.com', status: '搜索完成', total: 11131, unlocked: 0 },
  { site: 'plagiarismremover.net', status: '搜索完成', total: 0, unlocked: 0 },
  { site: 'web2pdfconvert.com', status: '搜索完成', total: 0, unlocked: 0 },
];

export default function ListeningPage() {
  const { t } = useTranslation('common');
  const [sites] = useState(mockSites);
  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8">
      <div className="bg-white dark:bg-[#232136] rounded-2xl shadow p-6">
        <div className="font-bold text-lg mb-4 text-gray-900 dark:text-white">{t('listening_sites')}</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-500 dark:text-gray-300">
                <th className="px-3 py-2">{t('site')}</th>
                <th className="px-3 py-2">{t('search_status')}</th>
                <th className="px-3 py-2">{t('total_data')}</th>
                <th className="px-3 py-2">{t('unlocked')}</th>
                <th className="px-3 py-2">{t('action')}</th>
              </tr>
            </thead>
            <tbody>
              {sites.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">{t('no_sites')}</td></tr>
              ) : sites.map((row, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-3 py-2 font-bold text-gray-900 dark:text-white">{row.site}</td>
                  <td className="px-3 py-2">{row.status}</td>
                  <td className="px-3 py-2">{row.total}</td>
                  <td className="px-3 py-2">{row.unlocked}</td>
                  <td className="px-3 py-2"><button className="text-xs text-purple-600 hover:underline">{t('view_data')}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 