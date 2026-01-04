
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Camera, Utensils, Target, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';



const QuickActions = memo(() => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const actions = [
    {
      icon: Camera,
      label: 'Scan Food',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'Take a photo to analyze',
      action: () => toast({ title: "Food Scanner", description: "Camera food recognition coming soon!" })
    },
    {
      icon: Utensils,
      label: 'Meal Plan',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'View today\'s plan',
      action: () => navigate('/meal-plans')
    },
    {
      icon: Target,
      label: 'Set Goal',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'Update your targets',
      action: () => navigate('/nutrition-form')
    },
  ];

  return (
    <>
      <Card className="glass-effect hover-scale">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <Zap className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isMobile ? (
            // Mobile: Grid layout for better space usage
            <div className="grid grid-cols-2 gap-3">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={action.action}
                  className={`flex flex-col items-center justify-center h-20 rounded-xl ${action.bgColor} border-none touch-manipulation active:scale-95 transition-all duration-200`}
                >
                  <action.icon className={`h-5 w-5 ${action.color} mb-1`} />
                  <span className="text-xs font-medium text-center leading-tight">
                    {action.label}
                  </span>
                </Button>
              ))}
            </div>
          ) : (
            // Desktop: Vertical list
            <div className="space-y-3">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={action.action}
                  className="w-full justify-start space-x-3 p-4 h-auto bg-card hover:bg-accent border-border hover-scale"
                >
                  <div className={`p-2 rounded-lg ${action.bgColor}`}>
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-foreground">{action.label}</div>
                    <div className="text-sm text-muted-foreground">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </>
  );
});

QuickActions.displayName = 'QuickActions';

export default QuickActions;
