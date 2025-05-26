import DashboardSidebar from '../../components/DashboardSidebar';
import NotImplemented from '../../components/NotImplemented';
import { useTranslation } from 'next-i18next';

export default function ListeningPage() {
  const { t } = useTranslation();

  return (
    <div className="flex bg-[#181825] min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-8 max-w-6xl mx-auto flex items-center justify-center">
        <NotImplemented title={t('sidebar_listening')} />
      </main>
    </div>
  );
} 