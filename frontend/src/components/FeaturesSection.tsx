
import { Card, CardContent } from '@/components/ui/card';
import { User, BarChart, Calendar, Contact } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: User,
      title: "Personalized Plans",
      description: "AI-powered nutrition plans tailored to your unique health goals, dietary preferences, and lifestyle.",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: BarChart,
      title: "Smart Analytics",
      description: "Track your progress with detailed insights and visualizations of your nutritional journey.",
      color: "bg-health-50 text-health-600"
    },
    {
      icon: Calendar,
      title: "Meal Planning",
      description: "Get weekly meal plans with shopping lists and easy-to-follow recipes for every meal.",
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: Contact,
      title: "Expert Support",
      description: "Access to certified nutritionists and continuous support throughout your health journey.",
      color: "bg-orange-50 text-orange-600"
    }
  ];

  return (
    <section
      id="features"
      className="scroll-mt-24 md:scroll-mt-28 py-20 relative w-full overflow-x-hidden animate-fade-in"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-foreground">
            Why Choose NutriGuide AI?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our advanced AI technology combined with nutritional science delivers 
            personalized solutions that adapt to your changing needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className={`card-hover glass-panel animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
