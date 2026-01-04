
import Navigation from '@/components/Navigation';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import Footer from '@/components/Footer';
import { usePageTitle } from '@/hooks/use-page-title';

const Analytics = () => {
  usePageTitle('Analytics');
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navigation />
      <AnalyticsDashboard />
      <Footer />
    </div>
  );
};

export default Analytics;
