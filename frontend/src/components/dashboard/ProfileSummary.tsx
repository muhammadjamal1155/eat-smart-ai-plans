import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowDown, ArrowUp, Droplet, Flame, User, Mail } from 'lucide-react';
import type { LifestylePreferences, NutritionTargets } from '@/contexts/AuthContext';

interface UserProfile {
  name?: string;
  goal?: string;
  weight?: number;
  height?: number;
  age?: number;
  progress?: number;
  nutrition?: NutritionTargets;
  lifestyle?: LifestylePreferences;
  email?: string;
}

interface ProfileSummaryProps {
  user: UserProfile | null;
}

const formatGoal = (goal?: string) => {
  if (!goal) return 'Weight Loss';
  return goal.replace('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const ProfileSummary = memo(({ user }: ProfileSummaryProps) => {
  const progress = user?.progress ?? -2.5;
  const nutrition: NutritionTargets = user?.nutrition ?? {};
  const lifestyle: LifestylePreferences = user?.lifestyle ?? {};

  return (
    <Card className="border border-border/80 bg-card/90 shadow-lg shadow-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-card-foreground text-base sm:text-lg">
            <User className="h-5 w-5 text-primary" />
            Profile Summary
          </CardTitle>
          <Badge variant="secondary" className="whitespace-nowrap">{formatGoal(user?.goal)}</Badge>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Mail className="h-5 w-5 text-primary" />
          <span className="text-xs sm:text-sm text-foreground font-bold tracking-tight">
            {user?.email || 'member@nutriguide.ai'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border/70 bg-muted/40 p-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
            {(user?.name || 'NG')
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold">{user?.name || 'Demo User'}</p>
            <p className="text-sm text-muted-foreground">Goal: {formatGoal(user?.goal)}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Body metrics</p>
            <div className="mt-3 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Weight</span>
                <span className="font-semibold">{user?.weight || 70} kg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Height</span>
                <span className="font-semibold">{user?.height || 175} cm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Age</span>
                <span className="font-semibold">{user?.age || 28} yrs</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Progress</p>
            <div className="mt-3 flex items-center justify-between rounded-md bg-primary/5 p-3 text-sm font-medium text-primary">
              <span>Weight change</span>
              <span className="flex items-center gap-1">
                {progress < 0 ? (
                  <ArrowDown className="h-4 w-4" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
                {Math.abs(progress)} kg
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Keep logging your meals daily to maintain this trend.
            </p>
          </div>
        </div>

        <Separator />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border/80 bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Daily macros</span>
              <Flame className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Calories</p>
                <p className="font-semibold text-foreground">
                  {nutrition.calories ?? '—'}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">kcal</span>
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Protein</p>
                <p className="font-semibold text-foreground">
                  {nutrition.protein ?? '—'}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">g</span>
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Carbs</p>
                <p className="font-semibold text-foreground">
                  {nutrition.carbs ?? '—'}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">g</span>
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Fats</p>
                <p className="font-semibold text-foreground">
                  {nutrition.fats ?? '—'}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">g</span>
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border/80 bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Hydration & lifestyle</span>
              <Droplet className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Hydration goal</span>
                <span className="font-semibold text-foreground">
                  {lifestyle.hydrationGoal ? `${lifestyle.hydrationGoal} L` : '2.5 L default'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Activity level</span>
                <span className="font-semibold text-foreground">
                  {lifestyle.activityLevel
                    ? lifestyle.activityLevel.replace('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
                    : 'Moderate'}
                </span>
              </div>
              <div>
                <p className="text-muted-foreground">Dietary preference</p>
                <p className="font-semibold text-foreground">
                  {lifestyle.dietaryPreference
                    ? lifestyle.dietaryPreference.replace('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
                    : 'Balanced diet'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ProfileSummary.displayName = 'ProfileSummary';

export default ProfileSummary;
