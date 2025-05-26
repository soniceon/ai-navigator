import { useTranslation } from 'next-i18next';
import DashboardSidebar from '../../components/DashboardSidebar';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const tools = [
  { name: 'tool_chatgpt', url: 'https://chat.openai.com', type: 'type_chat', date: '2024-05-01', status: 'status_online' },
  { name: 'tool_midjourney', url: 'https://midjourney.com', type: 'type_image', date: '2024-05-02', status: 'status_reviewing' },
];

export default function ToolsPage() {
  const { t } = useTranslation('common');
  return (
    <div className="flex bg-[#181825] min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-8 max-w-6xl mx-auto">
        <div className="bg-[rgba(24,24,37,0.6)] backdrop-blur-lg rounded-2xl shadow-xl border border-[rgba(255,255,255,0.15)] p-8">
          <div className="font-bold text-lg mb-6 text-gray-100">{t('my_tools')}</div>
          <table className="min-w-full text-base">
            <thead>
              <tr className="text-purple-300 border-b border-gray-700 text-base">
                <th>{t('tool')}</th><th>{t('website')}</th><th>{t('type')}</th><th>{t('date')}</th><th>{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((row, i) => (
                <tr key={i} className="border-t border-gray-700 text-gray-100">
                  <td>{t(row.name)}</td>
                  <td><a href={row.url} className="text-purple-400 font-semibold underline" target="_blank" rel="noopener noreferrer">{row.url}</a></td>
                  <td>{t(row.type)}</td>
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

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  };
} 