
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

const HeroSection = () => {
  const scrollToNext = () => {
    const element = document.querySelector('#features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-gradient min-h-screen flex items-center justify-center pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Eat Smart,{' '}
                <span className="text-health-600">Live Healthy</span>{' '}
                with NutriGuide AI
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Get personalized diet plans and nutrition recommendations powered by advanced AI. 
                Transform your eating habits and achieve your health goals with science-backed guidance.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="btn-primary text-lg px-8 py-4">
                Start Your Journey
              </Button>
              <Button size="lg" variant="outline" className="btn-secondary text-lg px-8 py-4">
                Learn More
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-health-600">10K+</div>
                <div className="text-sm text-gray-600">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-health-600">50K+</div>
                <div className="text-sm text-gray-600">Meal Plans Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-health-600">98%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative animate-scale-in">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80"
                alt="Healthy Food Bowl"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg animate-pulse-green">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-health-100 rounded-full flex items-center justify-center">
                    <span className="text-health-600 font-bold">AI</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Smart Analysis</div>
                    <div className="text-sm text-gray-600">Personalized for you</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-16">
          <button
            onClick={scrollToNext}
            className="animate-bounce p-2 rounded-full bg-white/50 hover:bg-white/80 transition-all duration-200"
          >
            <ArrowDown className="w-6 h-6 text-health-600" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
