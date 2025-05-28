
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import AuthSection from '@/components/AuthSection';
import DashboardSection from '@/components/DashboardSection';
import MealPlanSection from '@/components/MealPlanSection';
import InsightsSection from '@/components/InsightsSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <AuthSection />
      <DashboardSection />
      <MealPlanSection />
      <InsightsSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
