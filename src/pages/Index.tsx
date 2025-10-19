import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import LandingHighlights from '@/components/LandingHighlights';
import LandingPreview from '@/components/LandingPreview';
import LandingCTA from '@/components/LandingCTA';
import Footer from '@/components/Footer';

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTo = params.get('scroll_to');
    if (scrollTo) {
      const element = document.getElementById(scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <LandingHighlights />
      <LandingPreview />
      <LandingCTA />
      <Footer />
    </div>
  );
};

export default Index;
