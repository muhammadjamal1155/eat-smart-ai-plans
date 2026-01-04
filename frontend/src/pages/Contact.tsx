
import Navigation from '@/components/Navigation';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { usePageTitle } from '@/hooks/use-page-title';

const Contact = () => {
  usePageTitle('Contact Us');
  return (
    <div className="min-h-screen">
      <Navigation />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Contact;
