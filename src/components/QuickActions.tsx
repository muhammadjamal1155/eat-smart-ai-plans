
import { memo } from 'react';
import { Plus, Camera, Utensils, Target, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';

const QuickActions = memo(() => {
  const isMobile = useIsMobile();

  const actions = [
    { 
      icon: Plus, 
      label: 'Log Meal', 
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'Add your latest meal',
      action: () => toast({ title: "Add Meal", description: "Meal logging feature coming soon!" })
    },
    { 
      icon: Camera, 
      label: 'Scan Food', 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Take a photo to analyze',
      action: () => toast({ title: "Food Scanner", description: "Camera food recognition coming soon!" })
    },
    { 
      icon: Utensils, 
      label: 'Meal Plan', 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'View today\'s plan',
      action: () => toast({ title: "Meal Plans", description: "Meal planning feature coming soon!" })
    },
    { 
      icon: Target, 
      label: 'Set Goal', 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Update your targets',
      action: () => toast({ title: "Goal Setting", description: "Advanced goal setting coming soon!" })
    },
  ];

  return (
    <Card className="glass-effect hover-scale">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <Zap className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isMobile ? (
          // Mobile: Horizontal scrollable actions
          <div className="flex space-x-3 overflow-x-auto pb-2 -mx-2 px-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={action.action}
                className={`flex-shrink-0 flex flex-col items-center justify-center h-20 w-20 rounded-xl ${action.bgColor} border-none touch-manipulation active:scale-95 transition-all duration-200`}
              >
                <action.icon className={`h-6 w-6 ${action.color} mb-1`} />
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
                className={`w-full justify-start space-x-3 p-4 h-auto ${action.bgColor} border-none hover-scale`}
              >
                <div className={`p-2 rounded-lg ${action.bgColor}`}>
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <div className="text-left">
                  <div className="font-medium">{action.label}</div>
                  <div className="text-sm text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

QuickActions.displayName = 'QuickActions';

export default QuickActions;
