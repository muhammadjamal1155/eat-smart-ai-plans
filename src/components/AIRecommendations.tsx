
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, TrendingUp, Clock, Target, Lightbulb } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Recommendation {
  id: string;
  type: 'meal' | 'nutrition' | 'habit' | 'goal';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  actionText: string;
}

const AIRecommendations = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: '1',
      type: 'meal',
      title: 'Add More Protein at Breakfast',
      description: 'Based on your current intake, adding 15g more protein at breakfast could help you reach your daily goals.',
      impact: 'high',
      category: 'Nutrition',
      actionText: 'View Protein-Rich Meals'
    },
    {
      id: '2',
      type: 'nutrition',
      title: 'Increase Fiber Intake',
      description: 'You\'re currently getting 18g of fiber daily. Aim for 25-30g to improve digestive health.',
      impact: 'medium',
      category: 'Health',
      actionText: 'Find High-Fiber Foods'
    },
    {
      id: '3',
      type: 'habit',
      title: 'Meal Prep Sunday',
      description: 'Preparing meals in advance could save you 2 hours per week and improve consistency.',
      impact: 'high',
      category: 'Efficiency',
      actionText: 'Create Prep Plan'
    },
    {
      id: '4',
      type: 'goal',
      title: 'Hydration Reminder',
      description: 'Drinking more water before meals can help with satiety and weight management.',
      impact: 'medium',
      category: 'Wellness',
      actionText: 'Set Reminders'
    }
  ]);

  const generateNewRecommendations = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newRecommendations: Recommendation[] = [
      {
        id: '5',
        type: 'meal',
        title: 'Try Mediterranean Diet',
        description: 'Based on your preferences, Mediterranean meals could improve your heart health markers.',
        impact: 'high',
        category: 'Nutrition',
        actionText: 'Explore Recipes'
      },
      {
        id: '6',
        type: 'nutrition',
        title: 'Optimize Post-Workout Nutrition',
        description: 'Eating within 30 minutes after exercise can improve your recovery and muscle building.',
        impact: 'medium',
        category: 'Performance',
        actionText: 'Create Post-Workout Plan'
      }
    ];
    
    setRecommendations(prev => [...newRecommendations, ...prev.slice(0, 4)]);
    setIsGenerating(false);
    
    toast({
      title: "New Recommendations Generated!",
      description: "AI has analyzed your recent data and created personalized suggestions.",
    });
  };

  const handleRecommendationAction = (recommendation: Recommendation) => {
    toast({
      title: "Action Started",
      description: `Working on: ${recommendation.title}`,
    });
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meal': return <Target className="w-4 h-4" />;
      case 'nutrition': return <TrendingUp className="w-4 h-4" />;
      case 'habit': return <Clock className="w-4 h-4" />;
      case 'goal': return <Lightbulb className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-health-600" />
            <span>AI Recommendations</span>
          </CardTitle>
          <Button 
            onClick={generateNewRecommendations}
            disabled={isGenerating}
            size="sm"
            className="btn-primary"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                {getTypeIcon(rec.type)}
                <h4 className="font-semibold text-gray-900">{rec.title}</h4>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={getImpactColor(rec.impact)}>
                  {rec.impact} impact
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {rec.category}
                </Badge>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleRecommendationAction(rec)}
              className="w-full"
            >
              {rec.actionText}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
