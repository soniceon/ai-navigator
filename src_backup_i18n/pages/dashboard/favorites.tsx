import DashboardSidebar from '../../components/DashboardSidebar';
import NotImplemented from '../../components/NotImplemented';

export default function FavoritesPage() {
  return (
    <div className="flex bg-[#181825] min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-8 max-w-6xl mx-auto flex items-center justify-center">
        <NotImplemented title="我的收藏" />
      </main>
    </div>
  );
} 