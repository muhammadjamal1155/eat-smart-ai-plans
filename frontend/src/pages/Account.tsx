import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProfileSummary from '@/components/dashboard/ProfileSummary';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, CalendarDays, Download, Flame, ShieldAlert } from 'lucide-react';
import type { LifestylePreferences, NutritionTargets } from '@/contexts/AuthContext';
import { usePageTitle } from '@/hooks/use-page-title';

const formatGoal = (goal?: string) =>
  goal ? goal.replace('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) : 'Goal not set';

const renderAllergies = (allergies?: LifestylePreferences['allergies']) => {
  if (!allergies || !allergies.length) {
    return 'No restrictions saved';
  }

  return allergies.join(', ');
};

const Account = () => {
  const { user, logout } = useAuth();
  usePageTitle('Account');

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col text-foreground">
        <Navigation />
        <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Create your NutriGuide account</h1>
          <p className="max-w-xl text-muted-foreground">
            Personalised nutrition plans, coaching nudges, and hydration reminders await once you sign in.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/register">Create account</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const nutrition: NutritionTargets = {
    calories: user.nutrition?.calories ?? null,
    protein: user.nutrition?.protein ?? null,
    carbs: user.nutrition?.carbs ?? null,
    fats: user.nutrition?.fats ?? null,
    fiber: user.nutrition?.fiber ?? null,
  };

  const lifestyle: LifestylePreferences = {
    activityLevel: user.lifestyle?.activityLevel,
    dietaryPreference: user.lifestyle?.dietaryPreference,
    allergies: user.lifestyle?.allergies,
    hydrationGoal: user.lifestyle?.hydrationGoal,
  };

  return (
    <div className="flex min-h-screen flex-col text-foreground">
      <Navigation />
      <main className="flex-1 pt-20">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_50%)]" />
          <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-16">
            <div className="max-w-2xl space-y-4">
              <Badge variant="outline" className="uppercase tracking-wide text-xs">
                Account Center
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Welcome back, {user.name || 'member'}</h1>
              <p className="text-lg text-muted-foreground">
                Review your subscription, adjust nutrition targets, and keep your profile up-to-date—just like any
                modern wellness app.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/profile">
                    Edit profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/dashboard">View dashboard</Link>
                </Button>
                <Button variant="ghost" size="lg" onClick={logout}>
                  Log out
                </Button>
              </div>
            </div>
            <Card className="w-full max-w-sm border border-primary/20 bg-primary/5 shadow-lg shadow-primary/10">
              <CardHeader>
                <CardTitle>Membership overview</CardTitle>
                <CardDescription>NutriGuide Premium · Renewing monthly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Next billing date</span>
                  <span className="font-medium">25 Oct 2025</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Plan goal</span>
                  <span className="font-medium">{formatGoal(user.goal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{user.email}</span>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/billing">Manage billing</Link>
                </Button>
                <Button size="sm" variant="ghost" className="text-primary" asChild>
                  <Link to="/help-center">Need help?</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-card/60">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium">Daily nutrition targets</CardTitle>
                  <Flame className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Calories</span>
                    <span className="font-semibold">
                      {nutrition.calories ?? '—'}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">kcal</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Protein</span>
                    <span className="font-semibold">
                      {nutrition.protein ?? '—'}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">g</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Carbs</span>
                    <span className="font-semibold">
                      {nutrition.carbs ?? '—'}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">g</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fats</span>
                    <span className="font-semibold">
                      {nutrition.fats ?? '—'}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">g</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fiber</span>
                    <span className="font-semibold">
                      {nutrition.fiber ?? '—'}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">g</span>
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <Button size="sm" variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/profile">Adjust macros</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/60">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium">Lifestyle preferences</CardTitle>
                  <CalendarDays className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Activity level</span>
                    <span className="font-semibold">
                      {lifestyle.activityLevel
                        ? lifestyle.activityLevel.replace('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
                        : 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dietary preference</span>
                    <span className="font-semibold">
                      {lifestyle.dietaryPreference
                        ? lifestyle.dietaryPreference.replace('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
                        : 'Balanced'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Allergies & exclusions</span>
                    <p className="mt-1 font-semibold">{renderAllergies(lifestyle.allergies)}</p>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hydration goal</span>
                    <span className="font-semibold">
                      {lifestyle.hydrationGoal ? `${lifestyle.hydrationGoal} L` : '2.5 L (default)'}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <Button size="sm" variant="ghost" className="w-full justify-start" asChild>
                    <Link to="/profile">Update preferences</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/60">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium">Downloads & exports</CardTitle>
                  <Download className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    Export your personalised meal plans, grocery lists, or nutrition reports for check-ins with your
                    coach.
                  </p>
                  <div className="grid gap-2">
                    <Button variant="outline" size="sm" className="justify-between" asChild>
                      <Link to="/exports/meal-plan.pdf">
                        Weekly meal plan PDF
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="justify-between" asChild>
                      <Link to="/exports/grocery.csv">
                        Grocery checklist CSV
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="justify-between" asChild>
                      <Link to="/exports/macros.csv">
                        Macro log CSV
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-muted/40 py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-[2fr_3fr]">
              <div className="space-y-6">
                <ProfileSummary user={user} />
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly focus</CardTitle>
                    <CardDescription>Fine-tuned recommendations from your coach.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                      <p className="font-medium text-primary">Protein consistency</p>
                      <p className="mt-1 text-primary/80">
                        You hit 80% of your protein goal last week. Add a high-protein breakfast option on training days.
                      </p>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <p className="font-medium text-foreground">Hydration reminder</p>
                      <p className="mt-1 text-muted-foreground">
                        Schedule two water reminders in the afternoon to reach your {lifestyle.hydrationGoal ?? 2.5} L
                        target.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account & security</CardTitle>
                    <CardDescription>Keep your account as secure as your fitness tracker.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="mt-1 h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Two-factor authentication</p>
                        <p className="text-muted-foreground">Add an extra layer of security to your NutriGuide account.</p>
                      </div>
                      <Button size="sm" variant="outline" className="ml-auto" asChild>
                        <Link to="/settings/security">Enable</Link>
                      </Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="font-medium text-foreground">Current device</p>
                        <p className="text-sm text-muted-foreground">Windows · Edge · United Kingdom</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Manage sessions
                      </Button>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <p className="font-medium text-foreground">Download your data</p>
                      <p className="text-sm text-muted-foreground">
                        Request a complete export of your health history, chat transcripts, and saved recipes.
                      </p>
                      <Button size="sm" className="mt-3" variant="secondary">
                        Request archive
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="destructive" size="sm">
                      Deactivate account
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming milestones</CardTitle>
                    <CardDescription>Stay on track with your nutrition journey.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="font-semibold text-foreground">Body composition check-in</p>
                        <p className="text-muted-foreground">Due 21 Oct · share progress photos</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Add reminder
                      </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="font-semibold text-foreground">Coach sync call</p>
                        <p className="text-muted-foreground">29 Oct · confirm availability</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="font-semibold text-foreground">Pantry refresh</p>
                        <p className="text-muted-foreground">Download updated grocery list</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/profile">View list</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
