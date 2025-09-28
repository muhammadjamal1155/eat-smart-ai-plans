import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const MobileApp = () => {
  const features = [
    "Personalized meal plans at your fingertips",
    "Real-time AI nutrition feedback",
    "Scan food items for instant analysis",
    "Track your progress on the go",
    "Sync with your favorite fitness apps",
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="mb-8 md:mb-12 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold">NutriGuide AI on the Go</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Access your personalized nutrition plan anytime, anywhere with our powerful mobile app.
              </p>
            </header>

            <div className="text-center space-y-8">
              <div className="flex justify-center gap-4">
                <Button size="lg" className="btn-primary">Download for iOS</Button>
                <Button size="lg" variant="outline" className="btn-secondary">Download for Android</Button>
              </div>

              <img
                src="/placeholder.svg"
                alt="App Screenshot"
                className="mx-auto rounded-lg shadow-xl w-full max-w-md"
              />

              <div className="text-left max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-6">App Features</h2>
                <ul className="space-y-4">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                      <span className="text-lg">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MobileApp;