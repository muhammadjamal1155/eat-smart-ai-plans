import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart } from 'lucide-react';

interface NutritionTarget {
  name: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

interface NutritionTargetsProps {
  targets: NutritionTarget[];
}

const NutritionTargets = memo(({ targets }: NutritionTargetsProps) => {
  return (
    <Card className="shadow-soft border border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-card-foreground">
          <BarChart className="w-5 h-5 text-primary" />
          <span>Today's Nutrition Targets</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {targets.map((target) => {
          const percentage = Math.min((target.current / target.target) * 100, 100);
          const remaining = Math.max(target.target - target.current, 0);
          
          return (
            <div key={target.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-card-foreground">{target.name}</span>
                <span className="text-sm text-muted-foreground">
                  {target.current}/{target.target} {target.unit}
                </span>
              </div>
              <Progress 
                value={percentage} 
                className="h-3" 
                aria-label={`${target.name} progress: ${Math.round(percentage)}%`}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.round(percentage)}% complete</span>
                <span>{remaining} {target.unit} remaining</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
});

NutritionTargets.displayName = 'NutritionTargets';

export default NutritionTargets;