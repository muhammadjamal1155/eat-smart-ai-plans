
import Navigation from '@/components/Navigation';
import MealPlanSection from '@/components/MealPlanSection';
import Footer from '@/components/Footer';
import { usePageTitle } from '@/hooks/use-page-title';

const MealPlans = () => {
  usePageTitle('Meal Plans');
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navigation />
      <MealPlanSection />
      <Footer />
    </div>
  );
};

export default MealPlans;
