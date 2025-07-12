
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
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Eat Smart,{' '}
                <span className="text-primary">Live Healthy</span>{' '}
                with NutriGuide AI
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Get personalized diet plans and nutrition recommendations powered by advanced AI. 
                Transform your eating habits and achieve your health goals with science-backed guidance.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="btn-primary text-lg px-8 py-4 interactive">
                Start Your Journey
              </Button>
              <Button size="lg" variant="outline" className="btn-secondary text-lg px-8 py-4 interactive">
                Learn More
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Meal Plans Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative animate-scale-in">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80"
                alt="Healthy Food Bowl"
                className="rounded-2xl shadow-large w-full h-96 object-cover float-animation"
              />
              <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-glow animate-pulse-green border border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">AI</span>
                  </div>
                  <div>
                    <div className="font-semibold text-card-foreground">Smart Analysis</div>
                    <div className="text-sm text-muted-foreground">Personalized for you</div>
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
            className="animate-bounce p-2 rounded-full glass-effect hover:bg-background/90 transition-all duration-200 interactive"
            aria-label="Scroll to features section"
          >
            <ArrowDown className="w-6 h-6 text-primary" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
