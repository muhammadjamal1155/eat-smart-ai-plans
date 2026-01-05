import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import LandingHighlights from '@/components/LandingHighlights';
import LandingPreview from '@/components/LandingPreview';
import LandingCTA from '@/components/LandingCTA';
import Footer from '@/components/Footer';
import { usePageTitle } from '@/hooks/use-page-title';

const Index = () => {
  usePageTitle('Home');
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/30 to-background relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />

        <div className="max-w-md w-full space-y-8 text-center z-10">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Welcome to NutriPlan
            </h1>
            <p className="text-muted-foreground text-lg">
              Your personal AI nutritionist. Eat smarter, live better.
            </p>
          </div>

          <div className="grid gap-4 pt-8">
            <Button
              size="lg"
              className="w-full text-lg h-14 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all rounded-xl"
              onClick={() => navigate('/nutrition-form')}
            >
              I'm New Here
              <span className="ml-2 bg-white/20 px-2 py-0.5 rounded text-sm">Start Journey</span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full text-lg h-14 border-2 hover:bg-secondary/50 transition-all rounded-xl"
              onClick={() => navigate('/login')}
            >
              I Have an Account
            </Button>
          </div>

          <p className="text-xs text-muted-foreground pt-8">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    );
  }

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
