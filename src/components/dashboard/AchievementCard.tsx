import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowUp, Trophy, Target } from 'lucide-react';

interface Achievement {
  title: string;
  message: string;
  progress: number;
  icon?: 'progress' | 'trophy' | 'target';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface AchievementCardProps {
  achievement?: Achievement;
}

const defaultAchievement: Achievement = {
  title: 'Great Progress!',
  message: "You're 70% closer to your goal this week. Keep it up!",
  progress: 70,
  icon: 'progress',
  action: {
    label: 'Plan Next Week',
    onClick: () => console.log('Planning next week...'),
  },
};

const getIcon = (type: Achievement['icon']) => {
  switch (type) {
    case 'trophy':
      return <Trophy className="w-6 h-6 text-primary-foreground" />;
    case 'target':
      return <Target className="w-6 h-6 text-primary-foreground" />;
    case 'progress':
    default:
      return <ArrowUp className="w-6 h-6 text-primary-foreground" />;
  }
};

const AchievementCard = memo(({ achievement = defaultAchievement }: AchievementCardProps) => {
  return (
    <Card className="shadow-soft border border-border bg-gradient-to-br from-accent to-accent/50">
      <CardContent className="p-6 text-center space-y-3">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto">
          {getIcon(achievement.icon)}
        </div>
        <h4 className="font-semibold text-card-foreground">{achievement.title}</h4>
        <p className="text-sm text-muted-foreground">
          {achievement.message}
        </p>
        {achievement.action && (
          <Button 
            className="w-full btn-primary mt-3 interactive" 
            onClick={achievement.action.onClick}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {achievement.action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
});

AchievementCard.displayName = 'AchievementCard';

export default AchievementCard;