import { useTranslation } from 'next-i18next';
import DashboardSidebar from '../../components/DashboardSidebar';

const ads = [
  { tool: 'tool_chatgpt', url: 'ad_url_chatgpt', balance: 100, status: 'status_running' },
  { tool: 'tool_midjourney', url: 'ad_url_midjourney', balance: 0, status: 'status_stopped' },
];

export default function AdsPage() {
  const { t } = useTranslation('common');
  return (
    <div className="flex bg-[#181825] min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-8 max-w-6xl mx-auto">
        <div className="bg-[rgba(24,24,37,0.6)] backdrop-blur-lg rounded-2xl shadow-xl border border-[rgba(255,255,255,0.15)] p-8">
          <div className="font-bold text-lg mb-6 text-gray-100">{t('my_ads')}</div>
          <table className="min-w-full text-base">
            <thead>
              <tr className="text-purple-300 border-b border-gray-700 text-base">
                <th>{t('tool')}</th><th>{t('ad_url')}</th><th>{t('ad_balance')}</th><th>{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((row, i) => (
                <tr key={i} className="border-t border-gray-700 text-gray-100">
                  <td>{t(row.tool)}</td>
                  <td><a href={t(row.url)} className="text-purple-400 font-semibold underline" target="_blank" rel="noopener noreferrer">{t(row.url)}</a></td>
                  <td>{row.balance}</td>
                  <td>{t(row.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
} 