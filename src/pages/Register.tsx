
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import RegisterForm from '@/components/RegisterForm';
import { useAuth } from '@/hooks/use-auth';

const Register = () => { const navigate = useNavigate(); const location = useLocation();
  useEffect(() => {
    document.title = 'Register | NutriPlan';
    const desc = 'Create your NutriPlan account to build meal plans and track nutrition goals.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${window.location.origin}/register`);
  }, []);
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (isAuthenticated) {
      const state = location.state as { from?: { pathname: string } } | null;
      const redirectTo = state?.from?.pathname || '/account';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);
  return (
    <div className="min-h-screen text-foreground">
      <Navigation />
      <main className="pt-20">
        <section className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="mb-8 md:mb-12 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold">Create your account</h1>
              <p className="mt-2 text-muted-foreground">Start your personalized nutrition journey.</p>
            </header>
            <div className="max-w-md mx-auto">
              <RegisterForm onSwitchToLogin={() => navigate('/login')} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
