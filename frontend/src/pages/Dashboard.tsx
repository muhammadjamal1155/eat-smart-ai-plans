
import Navigation from '@/components/Navigation';
import DashboardSection from '@/components/DashboardSection';
import Footer from '@/components/Footer';
import { usePageTitle } from '@/hooks/use-page-title';

const Dashboard = () => {
  usePageTitle('Dashboard');
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navigation />
      <DashboardSection />
      <Footer />
    </div>
  );
};

export default Dashboard;
