import Navigation from '@/components/Navigation';
import InsightsSection from '@/components/InsightsSection';
import Footer from '@/components/Footer';
import { usePageTitle } from '@/hooks/use-page-title';

const Insights = () => {
  usePageTitle('Insights');
  return (
    <div className="min-h-screen w-full overflow-x-hidden text-foreground transition-colors">
      <Navigation />
      <InsightsSection />
      <Footer />
    </div>
  );
};

export default Insights;
