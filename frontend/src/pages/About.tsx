
import Navigation from '@/components/Navigation';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import { usePageTitle } from '@/hooks/use-page-title';

const About = () => {
  usePageTitle('About Us');
  return (
    <div className="min-h-screen">
      <Navigation />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default About;
