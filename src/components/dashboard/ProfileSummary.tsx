import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, ArrowDown, ArrowUp } from 'lucide-react';

interface UserProfile {
  name?: string;
  goal?: string;
  weight?: number;
  height?: number;
  age?: number;
  progress?: number;
}

interface ProfileSummaryProps {
  user: UserProfile | null;
}

const ProfileSummary = memo(({ user }: ProfileSummaryProps) => {
  const formatGoal = (goal?: string) => {
    if (!goal) return 'Weight Loss';
    return goal.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const progress = user?.progress || -2.5; // Default negative for weight loss

  return (
    <Card className="shadow-soft border border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-card-foreground">
          <User className="w-5 h-5 text-primary" />
          <span>Profile Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-card-foreground">
            {user?.name || 'Demo User'}
          </h3>
          <p className="text-sm text-muted-foreground">
            Goal: {formatGoal(user?.goal)}
          </p>
        </div>
        
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current Weight</span>
            <span className="font-medium text-card-foreground">
              {user?.weight || 70} kg
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Height</span>
            <span className="font-medium text-card-foreground">
              {user?.height || 175} cm
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Age</span>
            <span className="font-medium text-card-foreground">
              {user?.age || 28} years
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Progress</span>
            <div className="flex items-center space-x-1">
              {progress < 0 ? (
                <ArrowDown className="w-4 h-4 text-primary" />
              ) : (
                <ArrowUp className="w-4 h-4 text-primary" />
              )}
              <span className="font-medium text-primary">
                {Math.abs(progress)} kg
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ProfileSummary.displayName = 'ProfileSummary';

export default ProfileSummary;