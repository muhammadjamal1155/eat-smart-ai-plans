
import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import ProfileSummary from '@/components/dashboard/ProfileSummary';

const Account = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'Account | NutriPlan';
    const desc = 'Manage your NutriPlan account, profile, and nutrition preferences.';
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
    canonical.setAttribute('href', `${window.location.origin}/account`);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background text-foreground">
      <Navigation />
      <main className="pt-20">
        <section className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="mb-8 md:mb-12 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold">Your Account</h1>
              <p className="mt-2 text-muted-foreground">View and manage your profile details.</p>
            </header>
            <div className="max-w-2xl mx-auto">
              <ProfileSummary user={user} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
