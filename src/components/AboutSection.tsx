
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, User, Calendar, Contact } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: BarChart,
      title: "Advanced AI Engine",
      description: "Our proprietary machine learning algorithms analyze thousands of nutritional data points to create personalized recommendations."
    },
    {
      icon: User,
      title: "Personalized Approach",
      description: "Every recommendation is tailored to your unique body composition, lifestyle, and health goals."
    },
    {
      icon: Calendar,
      title: "Continuous Learning",
      description: "The system learns from your progress and feedback to continuously improve your meal plans."
    },
    {
      icon: Contact,
      title: "Evidence-Based",
      description: "All recommendations are backed by peer-reviewed research and validated nutritional science."
    }
  ];

  const dataSources = [
    "USDA Food Database",
    "NIH Nutritional Research",
    "WHO Dietary Guidelines",
    "Medical Literature Reviews",
    "Clinical Trial Data"
  ];

  return (
    <section id="about" className="py-20 bg-gray-50 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            About NutriGuide AI
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing nutrition guidance through artificial intelligence and evidence-based science
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">
              The Science Behind NutriGuide AI
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              NutriGuide AI combines cutting-edge artificial intelligence with decades of nutritional research 
              to provide personalized diet recommendations that actually work. Our system analyzes your unique 
              metabolic profile, dietary preferences, and lifestyle factors to create meal plans that are not 
              only effective but also sustainable.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Unlike generic diet plans, our AI continuously learns from your progress, adapting recommendations 
              in real-time to ensure you stay on track towards your health goals. Every suggestion is backed by 
              peer-reviewed research and validated nutritional science.
            </p>
            
            <div className="space-y-3">
              <h4 className="text-xl font-semibold text-gray-900">Data Sources:</h4>
              <div className="flex flex-wrap gap-2">
                {dataSources.map((source) => (
                  <Badge key={source} variant="secondary" className="text-sm py-1 px-3">
                    {source}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=600&q=80"
              alt="Scientific Research"
              className="rounded-2xl shadow-2xl w-full h-96 object-cover"
            />
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg max-w-[calc(100%-2rem)]">
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-health-600">99.2%</div>
                <div className="text-sm text-gray-600">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className={`card-hover border-0 shadow-lg animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-health-100 text-health-600 rounded-2xl flex items-center justify-center mx-auto">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Methodology Section */}
        <Card className="shadow-2xl border-0 bg-gradient-to-r from-health-50 to-blue-50">
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900">Our Methodology</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-health-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Data Collection</h4>
                      <p className="text-gray-600">Comprehensive analysis of your health profile, goals, and preferences.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-health-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">AI Processing</h4>
                      <p className="text-gray-600">Machine learning algorithms process thousands of nutritional variables.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-health-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Personalization</h4>
                      <p className="text-gray-600">Custom meal plans generated based on your unique metabolic profile.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-health-500 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Continuous Optimization</h4>
                      <p className="text-gray-600">Real-time adjustments based on your progress and feedback.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Statistics</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Users Served</span>
                    <span className="font-bold text-health-600">10,000+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-bold text-health-600">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg. Weight Loss</span>
                    <span className="font-bold text-health-600">8.5 kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Data Points Analyzed</span>
                    <span className="font-bold text-health-600">500K+</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AboutSection;
