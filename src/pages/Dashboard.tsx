
import Navigation from '@/components/Navigation';
import DashboardSection from '@/components/DashboardSection';
import Footer from '@/components/Footer';

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <DashboardSection />
      <Footer />
    </div>
  );
};

export default Dashboard;
