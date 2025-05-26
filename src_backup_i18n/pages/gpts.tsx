import { useTranslation } from 'next-i18next';
import { useState } from 'react';

const mockGpts = [
  { name: 'AI写作助手', date: '2024-05-01', status: '已上线' },
  { name: 'AI翻译官', date: '2024-05-02', status: '审核中' },
];

export default function GptsPage() {
  const { t } = useTranslation('common');
  const [gpts] = useState(mockGpts);
  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-8">
      <div className="flex gap-4 mb-6">
        <button className="px-4 py-2 bg-purple-600 text-white rounded">{t('submit_new_gpt')}</button>
      </div>
      <div className="bg-white dark:bg-[#232136] rounded-2xl shadow p-6">
        <div className="font-bold text-lg mb-4 text-gray-900 dark:text-white">{t('my_gpts')}</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-500 dark:text-gray-300">
                <th className="px-3 py-2">{t('gpt_name')}</th>
                <th className="px-3 py-2">{t('date')}</th>
                <th className="px-3 py-2">{t('status')}</th>
                <th className="px-3 py-2">{t('action')}</th>
              </tr>
            </thead>
            <tbody>
              {gpts.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-400">{t('no_gpts')}</td></tr>
              ) : gpts.map((row, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-3 py-2 font-bold text-gray-900 dark:text-white">{row.name}</td>
                  <td className="px-3 py-2">{row.date}</td>
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