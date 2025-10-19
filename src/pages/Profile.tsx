import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import type { LifestylePreferences, NutritionTargets } from '@/contexts/AuthContext';

type ProfileFormState = {
  name: string;
  email: string;
  goal: string;
  age: string;
  weight: string;
  height: string;
  activityLevel: ActivityLevel;
  dietaryPreference: string;
  allergies: string;
  hydrationGoal: string;
  timezone: string;
};

type NutritionFormState = {
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  fiber: string;
};

type ActivityLevel = NonNullable<LifestylePreferences['activityLevel']>;

const goalOptions = [
  { value: 'weight-loss', label: 'Weight Loss' },
  { value: 'weight-gain', label: 'Weight Gain' },
  { value: 'muscle-gain', label: 'Muscle Gain' },
  { value: 'maintenance', label: 'Maintain Weight' },
  { value: 'general-health', label: 'General Health' },
];

const dietaryOptions = [
  { value: 'balanced', label: 'Balanced Diet' },
  { value: 'keto', label: 'Ketogenic' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten Free' },
];

const activityOptions: ActivityLevel[] = [
  'sedentary',
  'light',
  'moderate',
  'active',
  'very-active',
];

const formatGoal = (goal?: string) =>
  goal ? goal.replace('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) : 'Goal not set';

const toNumber = (value: string) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const Profile = () => {
  const { user, updateUser, updateNutrition } = useAuth();
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingNutrition, setIsSavingNutrition] = useState(false);

  const initialProfileForm = useMemo<ProfileFormState>(
    () => ({
      name: user?.name ?? '',
      email: user?.email ?? '',
      goal: user?.goal ?? 'weight-loss',
      age: user?.age ? String(user.age) : '',
      weight: user?.weight ? String(user.weight) : '',
      height: user?.height ? String(user.height) : '',
      activityLevel: user?.lifestyle?.activityLevel ?? 'moderate',
      dietaryPreference: user?.lifestyle?.dietaryPreference ?? 'balanced',
      allergies: user?.lifestyle?.allergies?.join(', ') ?? '',
      hydrationGoal: user?.lifestyle?.hydrationGoal ? String(user.lifestyle.hydrationGoal) : '',
      timezone: user?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
    [user],
  );

  const initialNutritionForm = useMemo<NutritionFormState>(
    () => ({
      calories: user?.nutrition?.calories ? String(user.nutrition.calories) : '',
      protein: user?.nutrition?.protein ? String(user.nutrition.protein) : '',
      carbs: user?.nutrition?.carbs ? String(user.nutrition.carbs) : '',
      fats: user?.nutrition?.fats ? String(user.nutrition.fats) : '',
      fiber: user?.nutrition?.fiber ? String(user.nutrition.fiber) : '',
    }),
    [user],
  );

  const [profileForm, setProfileForm] = useState<ProfileFormState>(initialProfileForm);
  const [nutritionForm, setNutritionForm] = useState<NutritionFormState>(initialNutritionForm);

  useEffect(() => {
    setProfileForm(initialProfileForm);
    setNutritionForm(initialNutritionForm);
  }, [initialProfileForm, initialNutritionForm]);

  const initials = useMemo(() => {
    const source = user?.name?.trim() || user?.email || 'NG';
    return source
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  const handleProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    setIsSavingProfile(true);
    try {
      await updateUser({
        name: profileForm.name,
        email: profileForm.email,
        goal: profileForm.goal,
        age: toNumber(profileForm.age),
        weight: toNumber(profileForm.weight),
        height: toNumber(profileForm.height),
        timezone: profileForm.timezone,
        lifestyle: {
          activityLevel: profileForm.activityLevel,
          dietaryPreference: profileForm.dietaryPreference,
          allergies: profileForm.allergies
            ? profileForm.allergies.split(',').map((item) => item.trim()).filter(Boolean)
            : [],
          hydrationGoal: toNumber(profileForm.hydrationGoal),
        },
      });

      toast({
        title: 'Profile updated',
        description: 'Your personal details and lifestyle preferences are saved.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Update failed',
        description: 'We could not save your profile right now. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleNutritionSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    setIsSavingNutrition(true);
    try {
      const targets: NutritionTargets = {
        calories: toNumber(nutritionForm.calories) ?? null,
        protein: toNumber(nutritionForm.protein) ?? null,
        carbs: toNumber(nutritionForm.carbs) ?? null,
        fats: toNumber(nutritionForm.fats) ?? null,
        fiber: toNumber(nutritionForm.fiber) ?? null,
      };

      await updateNutrition(targets);

      toast({
        title: 'Nutrition targets saved',
        description: 'We will tailor your recommendations to these daily goals.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Unable to save targets',
        description: 'Something went wrong while saving your nutrition targets.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingNutrition(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navigation />
      <main className="mx-auto max-w-6xl px-4 pt-28 pb-12 sm:px-6 lg:pt-32 lg:pb-16">
        {!user ? (
          <div className="mx-auto flex h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">Let’s personalise your nutrition</h1>
            <p className="max-w-xl text-muted-foreground">
              Sign in to unlock tailored meal plans, calorie targets, and real-time coaching across your NutriGuide account.
            </p>
            <div className="flex items-center gap-4">
              <Button asChild size="lg">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/register">Create account</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
      <header className="flex flex-col gap-6 rounded-2xl border border-border bg-card/50 p-6 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border border-primary/20">
            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{user.name || 'Your profile'}</h1>
            <p className="text-muted-foreground">
              Manage everything from personal details to your nutrition strategy—all in one place.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Badge variant="secondary">{formatGoal(user.goal)}</Badge>
              <Badge variant="outline">{user.email}</Badge>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-primary md:w-72">
          <div className="space-y-1">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">Daily snapshot</p>
            <Separator className="bg-primary/20" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Calories</p>
              <p className="text-xl font-semibold">
                {user.nutrition?.calories ?? '—'}
                <span className="text-xs font-normal text-muted-foreground"> kcal</span>
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Protein</p>
              <p className="text-xl font-semibold">
                {user.nutrition?.protein ?? '—'}
                <span className="text-xs font-normal text-muted-foreground"> g</span>
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Carbs</p>
              <p className="text-xl font-semibold">
                {user.nutrition?.carbs ?? '—'}
                <span className="text-xs font-normal text-muted-foreground"> g</span>
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Fats</p>
              <p className="text-xl font-semibold">
                {user.nutrition?.fats ?? '—'}
                <span className="text-xs font-normal text-muted-foreground"> g</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      <Tabs defaultValue="profile" className="mt-10 space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition Targets</TabsTrigger>
          <TabsTrigger value="security">Security & devices</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal information</CardTitle>
              <CardDescription>Keep your contact details and health metrics current.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(event) => setProfileForm((prev) => ({ ...prev, name: event.target.value }))}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(event) => setProfileForm((prev) => ({ ...prev, email: event.target.value }))}
                      placeholder="you@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal">Primary goal</Label>
                    <Select
                      value={profileForm.goal}
                      onValueChange={(value) => setProfileForm((prev) => ({ ...prev, goal: value }))}
                    >
                      <SelectTrigger id="goal">
                        <SelectValue placeholder="Select your goal" />
                      </SelectTrigger>
                      <SelectContent>
                        {goalOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      value={profileForm.timezone}
                      onChange={(event) => setProfileForm((prev) => ({ ...prev, timezone: event.target.value }))}
                      placeholder="e.g. Europe/London"
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      min={13}
                      max={120}
                      value={profileForm.age}
                      onChange={(event) => setProfileForm((prev) => ({ ...prev, age: event.target.value }))}
                      placeholder="28"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      min={30}
                      max={300}
                      step={0.1}
                      value={profileForm.weight}
                      onChange={(event) => setProfileForm((prev) => ({ ...prev, weight: event.target.value }))}
                      placeholder="70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      min={120}
                      max={250}
                      value={profileForm.height}
                      onChange={(event) => setProfileForm((prev) => ({ ...prev, height: event.target.value }))}
                      placeholder="175"
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="activity-level">Activity level</Label>
                    <Select
                      value={profileForm.activityLevel}
                      onValueChange={(value: ActivityLevel) => setProfileForm((prev) => ({ ...prev, activityLevel: value }))}
                    >
                      <SelectTrigger id="activity-level">
                        <SelectValue placeholder="Typical daily activity" />
                      </SelectTrigger>
                      <SelectContent>
                        {activityOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option.replace('-', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dietary-preference">Dietary preference</Label>
                    <Select
                      value={profileForm.dietaryPreference}
                      onValueChange={(value) => setProfileForm((prev) => ({ ...prev, dietaryPreference: value }))}
                    >
                      <SelectTrigger id="dietary-preference">
                        <SelectValue placeholder="Select preference" />
                      </SelectTrigger>
                      <SelectContent>
                        {dietaryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="allergies">Allergies & exclusions</Label>
                    <Textarea
                      id="allergies"
                      value={profileForm.allergies}
                      onChange={(event) => setProfileForm((prev) => ({ ...prev, allergies: event.target.value }))}
                      placeholder="E.g. peanuts, shellfish, dairy"
                    />
                    <p className="text-xs text-muted-foreground">Separate with commas so we never recommend them.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hydration">Hydration goal (L/day)</Label>
                    <Input
                      id="hydration"
                      type="number"
                      min={1}
                      max={6}
                      step={0.1}
                      value={profileForm.hydrationGoal}
                      onChange={(event) => setProfileForm((prev) => ({ ...prev, hydrationGoal: event.target.value }))}
                      placeholder="2.5"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSavingProfile}>
                    {isSavingProfile ? 'Saving...' : 'Save profile settings'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily macro targets</CardTitle>
              <CardDescription>
                Set personalised calorie and macronutrient goals so NutriGuide can tailor your plans.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNutritionSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="calories">Calories</Label>
                    <Input
                      id="calories"
                      type="number"
                      min={800}
                      max={4000}
                      value={nutritionForm.calories}
                      onChange={(event) => setNutritionForm((prev) => ({ ...prev, calories: event.target.value }))}
                      placeholder="2100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="protein">Protein (g)</Label>
                    <Input
                      id="protein"
                      type="number"
                      min={20}
                      max={300}
                      value={nutritionForm.protein}
                      onChange={(event) => setNutritionForm((prev) => ({ ...prev, protein: event.target.value }))}
                      placeholder="140"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carbs">Carbohydrates (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      min={40}
                      max={500}
                      value={nutritionForm.carbs}
                      onChange={(event) => setNutritionForm((prev) => ({ ...prev, carbs: event.target.value }))}
                      placeholder="200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fats">Healthy fats (g)</Label>
                    <Input
                      id="fats"
                      type="number"
                      min={20}
                      max={200}
                      value={nutritionForm.fats}
                      onChange={(event) => setNutritionForm((prev) => ({ ...prev, fats: event.target.value }))}
                      placeholder="70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fiber">Fiber (g)</Label>
                    <Input
                      id="fiber"
                      type="number"
                      min={10}
                      max={80}
                      value={nutritionForm.fiber}
                      onChange={(event) => setNutritionForm((prev) => ({ ...prev, fiber: event.target.value }))}
                      placeholder="30"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSavingNutrition}>
                    {isSavingNutrition ? 'Saving...' : 'Save nutrition targets'}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="grid gap-4 text-sm text-muted-foreground md:grid-cols-3">
              <div>
                <p className="font-medium text-foreground">Smart meal plans</p>
                <p>We will balance your daily meals to stay within these targets, with built-in recipe swaps.</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Activity aware</p>
                <p>Link your tracker from the account tab to dynamically adjust calories on training days.</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Coach feedback</p>
                <p>Expect weekly nudges if you are trending above or below your set macro goals.</p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account security</CardTitle>
              <CardDescription>Protect your NutriGuide account like any other wellness platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <h3 className="font-semibold text-foreground">Password & recovery</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We recommend changing your password at least every 90 days. You can also trigger a reset email if you
                  suspect unauthorised access.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    onClick={() =>
                      toast({
                        title: 'Password reset sent',
                        description: `We just emailed a reset link to ${user.email}. Follow the instructions to choose a new password.`,
                      })
                    }
                  >
                    Send password reset
                  </Button>
                  <Button variant="outline">Enable two-factor (coming soon)</Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="text-base">Connected devices</CardTitle>
                    <CardDescription>Apple Health, Fitbit Sense</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      Manage connections
                    </Button>
                    <Button size="sm">Connect new</Button>
                  </CardFooter>
                </Card>
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="text-base">Login history</CardTitle>
                    <CardDescription>Last sign in: Today, 08:24 BST</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      View activity
                    </Button>
                    <Button size="sm" variant="destructive">
                      Sign out of all devices
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
