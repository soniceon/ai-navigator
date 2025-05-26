import { useTranslation } from 'next-i18next';
import DashboardSidebar from '../../components/DashboardSidebar';

const gpts = [
  { name: 'gpt_writing_assistant', date: '2024-05-01', status: 'status_online' },
  { name: 'gpt_translator', date: '2024-05-02', status: 'status_reviewing' },
];

export default function GptsPage() {
  const { t } = useTranslation('common');
  return (
    <div className="flex bg-[#181825] min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-8 max-w-6xl mx-auto">
        <div className="bg-[rgba(24,24,37,0.6)] backdrop-blur-lg rounded-2xl shadow-xl border border-[rgba(255,255,255,0.15)] p-8">
          <div className="font-bold text-lg mb-6 text-gray-100">{t('my_gpts')}</div>
          <table className="min-w-full text-base">
            <thead>
              <tr className="text-purple-300 border-b border-gray-700 text-base">
                <th>{t('gpt_name')}</th><th>{t('date')}</th><th>{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {gpts.map((row, i) => (
                <tr key={i} className="border-t border-gray-700 text-gray-100">
                  <td>{t(row.name)}</td>
                  <td>{row.date}</td>
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