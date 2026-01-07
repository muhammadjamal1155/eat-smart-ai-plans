import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import RecommendationResults from "@/components/RecommendationResults";
import { useAuth } from "@/hooks/use-auth";
import { usePageTitle } from "@/hooks/use-page-title";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronLeft, Check,
  Baby, User, Briefcase, Glasses,
  Trophy, Heart, Zap, Calendar, Flag,
  Target, Carrot, Apple
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Assuming you have these or use native select
import { getApiUrl } from "@/lib/api";

// --- Constants ---

const AGE_RANGES = [
  { id: "16-29", label: "16-29", icon: Baby, description: "Young & Energetic" },
  { id: "30-49", label: "30-49", icon: User, description: "Prime Time" },
  { id: "50-69", label: "50-69", icon: Briefcase, description: "Experienced" },
  { id: "70+", label: "70+", icon: Glasses, description: "Golden Years" },
];

const GOALS = [
  { id: "weight-loss", label: "Lose weight" },
  { id: "maintenance", label: "Maintain weight" },
  { id: "weight-gain", label: "Gain weight" },
  { id: "muscle-gain", label: "Build muscle" },
  { id: "other", label: "Something else" },
];

const MOTIVATIONS = [
  { id: "confidence", label: "To feel more confident", icon: Trophy },
  { id: "health", label: "To improve my overall health", icon: Heart },
  { id: "fitness", label: "To increase my fitness level", icon: Zap },
  { id: "event", label: "To prepare for a special event", icon: Calendar },
  { id: "recovery", label: "To build long-term healthy habits", icon: Flag },
];

const EXPERIENCES = [
  { id: "gained-want-more", label: "I've gained weight before and want to gain more." },
  { id: "tried-failed", label: "I've tried to gain weight before but was unsuccessful." },
  { id: "gained-lost", label: "I've gained weight before but lost it again." },
  { id: "never-tried", label: "I've never tried to gain weight before." },
];

const FEELINGS = [
  { id: "motivated", label: "Motivated" },
  { id: "confident", label: "Confident" },
  { id: "nervous", label: "Nervous" },
  { id: "frustrated", label: "Frustrated" },
  { id: "unmotivated", label: "Unmotivated" },
  { id: "unsure", label: "I'm not sure" },
];

const STRATEGIES = [
  { id: "log-meals", label: "I'm going to log all my meals before I eat." },
  { id: "partner", label: "I'm going to get an accountability partner." },
  { id: "meal-prep", label: "I'm going to meal prep and use recipes to plan ahead." },
  { id: "streak", label: "I'm going to see how long my tracking streak can get." },
  { id: "calories", label: "I'm going to pay attention to my calorie intake." },
  { id: "unsure", label: "I'm not sure yet." },
];

const CHALLENGES = [
  { id: "calories", label: "Replenishing burned calories" },
  { id: "motivation", label: "Staying motivated" },
  { id: "quality", label: "Eating enough quality foods" },
  { id: "what-to-eat", label: "Knowing what to eat" },
  { id: "busy", label: "Being too busy" },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function NutritionForm() {
  usePageTitle('Personalized Plan');
  const { user, updateUser, login, signIn, signUp } = useAuth();

  // Steps:
  // 0: Age Group
  // 1: Goal
  // 2: Motivation
  // 3: Experience
  // 4: Feelings
  // 5: Challenges
  // 6: Strategies
  // 7: Height
  // 8: Current Weight
  // 9: Goal Weight
  // 10: Birthday
  // 11: Benefits Animation
  // 12: Activity
  // 13: Diet
  // 14: Habits
  // 15: Loading -> Results

  // Auth State
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [authData, setAuthData] = useState({ name: '', email: '', password: '' });
  const [showResults, setShowResults] = useState(false);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);

  const [formData, setFormData] = useState({
    ageGroup: "",
    goal: user?.goal || "",
    motivation: "",
    experience: "",
    feeling: "",
    strategies: [] as string[],
    challenges: [] as string[],

    // Body Stats
    gender: user?.gender || "male", // default for calculation if not set
    height: user?.height?.toString() || "",
    heightFt: "",
    heightIn: "",
    heightUnit: "cm", // or 'ft'

    weight: user?.weight?.toString() || "",
    weightUnit: "kg", // or 'lbs'

    goalWeight: "",
    goalWeightUnit: "kg",

    birthDay: "",
    birthMonth: "",
    birthYear: "",

    activityLevel: "",
    dietType: "",
    foodAllergies: "",
    mealFrequency: "3",
    waterIntake: "2.5",
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleList = (field: 'challenges' | 'strategies', id: string) => {
    setFormData(prev => {
      const list = prev[field];
      if (list.includes(id)) return { ...prev, [field]: list.filter(i => i !== id) };
      return { ...prev, [field]: [...list, id] };
    });
  };

  const nextStep = () => {
    setDirection(1);
    setStep(s => s + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  // Auto-advance for Step 11 (Benefits Animation)
  useEffect(() => {
    if (step === 11) {
      const timer = setTimeout(() => {
        setStep(s => s + 1);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Handlers for specific stat inputs
  const handleHeightFtIn = (ft: string, inch: string) => {
    updateField("heightFt", ft);
    updateField("heightIn", inch);
    // approximate cm for internal use
    const cm = ((parseInt(ft || "0") * 12) + parseInt(inch || "0")) * 2.54;
    updateField("height", cm.toString());
  };

  // Submit Form Logic
  const submitForm = async () => {
    if (!formData.weight || !formData.height || !formData.ageGroup) {
      toast({ title: "Missing Information", description: "Please ensure all fields are filled out." });
      return;
    }

    setDirection(1);
    setStep(15); // Loading
    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      // Calculate inputs (same as before)
      let weightInKg = parseFloat(formData.weight);
      if (formData.weightUnit === 'lbs') weightInKg *= 0.453592;
      let heightInCm = parseFloat(formData.height);
      if (formData.heightUnit === 'ft') {
        heightInCm = ((parseInt(formData.heightFt || "0") * 12) + parseInt(formData.heightIn || "0")) * 2.54;
      }
      let age = 30;
      if (formData.birthYear) age = new Date().getFullYear() - parseInt(formData.birthYear);

      const payload = {
        age, weight: weightInKg, height: heightInCm, gender: formData.gender,
        goal: formData.goal, activity_level: formData.activityLevel,
        diet_type: formData.dietType,
        allergies: formData.foodAllergies ? formData.foodAllergies.split(',').map(s => s.trim()) : []
      };

      const response = await fetch(getApiUrl('/recommend'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
      const data = await response.json();

      setRecommendations(data);

      // Store user profile data temporarily for after-auth update
      const userProfile = { ...formData, age, weight: weightInKg, height: heightInCm, ...data };
      localStorage.setItem('tempUserProfile', JSON.stringify(userProfile));

      setTimeout(() => {
        setIsLoading(false);
        // GATE: If no user, go to Auth Step (100). If user, show results.
        if (!user) {
          setStep(100);
        } else {
          updateUserWithProfile(userProfile);
          setShowResults(true);
        }
      }, 500);

    } catch (e: any) {
      clearTimeout(timeoutId);
      console.error(e);
      toast({ title: "Error", description: e.message || "Failed to generate plan." });
      setStep(14);
      setIsLoading(false);
    }
  };

  const updateUserWithProfile = async (profileData: any) => {
    const userDataToUpdate = {
      name: user?.name || authData.name || "User",
      age: profileData.age,
      weight: profileData.weight,
      height: profileData.height,
      goal: profileData.goal,
      gender: profileData.gender,
      nutrition: {
        calories: recommendations?.target_calories || profileData.target_calories,
        protein: recommendations?.target_protein || profileData.target_protein,
        carbs: recommendations?.target_carbs || profileData.target_carbs,
        fats: recommendations?.target_fats || profileData.target_fats,
      },
      lifestyle: {
        activityLevel: profileData.activityLevel as any,
        dietaryPreference: profileData.dietType,
        allergies: profileData.foodAllergies ? profileData.foodAllergies.split(',') : [],
      }
    };
    await updateUser(userDataToUpdate);
  };

  const handleAuth = async () => {
    try {
      setIsLoading(true);
      let error = null;
      let sessionData = null;

      if (authMode === 'signup') {
        const { data, error: suError } = await signUp(authData.email, authData.password, authData.name);
        error = suError;
        sessionData = data;
      } else {
        const { data, error: siError } = await signIn(authData.email, authData.password);
        error = siError;
        sessionData = data;
      }

      if (error) throw error;

      // Handle Signup with Email Verification (No Session)
      if (authMode === 'signup' && sessionData && !sessionData.session) {
        toast({
          title: "Account Created!",
          description: "Please check your email to confirm your account before logging in."
        });
        setIsLoading(false);
        setAuthMode('login'); // Switch to login mode
        return;
      }

      // Success is handled by useEffect when 'user' triggers, 
      // but if we have a session and user is missing for some reason, we might want to manually force check?
      // For now, reliance on useEffect is standard for Supabase + AuthProvider.

    } catch (err: any) {
      toast({ title: "Authentication Failed", description: err.message, variant: "destructive" });
      setIsLoading(false);
    }
  };

  // Effect to handle post-authentication logic (Update Profile & Show Results)
  useEffect(() => {
    const handlePostAuth = async () => {
      // Only proceed if we are in the Auth Step (100) and the user is now authenticated
      if (step === 100 && user) {
        // ... (rest is same)
        setIsLoading(true);
        try {
          const tempProfile = localStorage.getItem('tempUserProfile');
          if (tempProfile) {
            const profile = JSON.parse(tempProfile);
            await updateUserWithProfile(profile);
            // Optional: localStorage.removeItem('tempUserProfile'); 
          }
          setIsLoading(false);
          setShowResults(true);
        } catch (e) {
          console.error("Post-auth update failed", e);
          setIsLoading(false);
          setShowResults(true); // Show results anyway
        }
      }
    };

    handlePostAuth();
  }, [user, step]); // Dependencies ensure this runs when user becomes authenticated


  // Results view condition
  if (showResults && recommendations) {
    return <RecommendationResults data={recommendations} onBack={() => { setRecommendations(null); setStep(0); setShowResults(false); }} />;
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 max-w-lg mx-auto font-sans relative">

      <AnimatePresence mode="wait" custom={direction}>
        {/* 0. Age Group */}
        {step === 0 && (
          <motion.div key="0" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="w-full space-y-6 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">What's your age group?</h1>
            <div className="grid grid-cols-2 gap-4">
              {AGE_RANGES.map(a => (
                <Card key={a.id} className={cn("cursor-pointer border transition-all duration-300 backdrop-blur-sm group hover:scale-[1.02]",
                  formData.ageGroup === a.id
                    ? "bg-primary/10 border-primary shadow-lg shadow-primary/5"
                    : "bg-white/60 border-slate-200 hover:bg-white/80 hover:border-slate-300 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20"
                )} onClick={() => { updateField('ageGroup', a.id); nextStep(); }}>
                  <CardContent className="p-6 flex flex-col items-center gap-3">
                    <a.icon className={cn("w-8 h-8 transition-colors", formData.ageGroup === a.id ? "text-primary flex-shrink-0" : "text-slate-700 group-hover:text-slate-900 dark:text-white/70 dark:group-hover:text-white")} />
                    <div>
                      <div className={cn("font-bold transition-colors", formData.ageGroup === a.id ? "text-primary" : "text-slate-900 dark:text-white/90")}>{a.label}</div>
                      <div className={cn("text-xs transition-colors", formData.ageGroup === a.id ? "text-primary/70" : "text-slate-500 dark:text-white/50")}>{a.description}</div>
                    </div>

                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div >
        )
        }

        {/* 1. Goal */}
        {
          step === 1 && (
            <motion.div key="1" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="w-full space-y-4 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">What is your main goal?</h1>
              <div className="flex flex-col gap-3">
                {GOALS.map(g => (
                  <Button key={g.id} variant="ghost" className={cn("h-16 justify-start text-lg px-6 border transition-all duration-300 backdrop-blur-sm",
                    formData.goal === g.id
                      ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5 scale-[1.02]"
                      : "bg-white/60 border-slate-200 text-slate-700 hover:bg-white/80 hover:border-slate-300 hover:text-slate-900 dark:bg-white/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10 dark:hover:border-white/20 dark:hover:text-white"
                  )} onClick={() => { updateField('goal', g.id); nextStep(); }}>
                    <span className="flex-1 text-left">{g.label}</span>
                    {formData.goal === g.id && <Check className="w-5 h-5 text-primary animate-in fade-in zoom-in" />}
                  </Button>
                ))}
              </div>
              <Button variant="ghost" onClick={prevStep} className="mt-4"><ChevronLeft className="w-4 h-4 mr-2" /> Back</Button>
            </motion.div>
          )
        }

        {/* 2. Motivation */}
        {
          step === 2 && (
            <motion.div key="2" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="w-full space-y-4 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">What motivates you?</h1>
              <div className="flex flex-col gap-3">
                {MOTIVATIONS.map(m => (
                  <Button key={m.id} variant="ghost" className={cn("h-16 justify-start text-lg px-6 gap-3 border transition-all duration-300 backdrop-blur-sm",
                    formData.motivation === m.id
                      ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5 scale-[1.02]"
                      : "bg-white/60 border-slate-200 text-slate-700 hover:bg-white/80 hover:border-slate-300 hover:text-slate-900 dark:bg-white/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10 dark:hover:border-white/20 dark:hover:text-white"
                  )} onClick={() => { updateField('motivation', m.id); nextStep(); }}>
                    <m.icon className={cn("w-5 h-5", formData.motivation === m.id ? "text-primary" : "text-slate-500 dark:text-white/50")} />
                    <span className="flex-1 text-left">{m.label}</span>
                  </Button>
                ))}
              </div>
              <Button variant="ghost" onClick={prevStep} className="mt-4"><ChevronLeft className="w-4 h-4 mr-2" /> Back</Button>
            </motion.div>
          )
        }

        {/* 3. Experience */}
        {
          step === 3 && (
            <motion.div key="3" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="w-full space-y-4 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">Your experience?</h1>
              <div className="flex flex-col gap-3">
                {EXPERIENCES.map(e => (
                  <Button key={e.id} variant="ghost" className={cn("h-auto py-5 justify-start text-left whitespace-normal border transition-all duration-300 backdrop-blur-sm",
                    formData.experience === e.id
                      ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5 scale-[1.02]"
                      : "bg-white/60 border-slate-200 text-slate-700 hover:bg-white/80 hover:border-slate-300 hover:text-slate-900 dark:bg-white/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10 dark:hover:border-white/20 dark:hover:text-white"
                  )} onClick={() => { updateField('experience', e.id); nextStep(); }}>
                    <span className="text-base leading-snug">{e.label}</span>
                  </Button>
                ))}
              </div>
              <Button variant="ghost" onClick={prevStep} className="mt-4"><ChevronLeft className="w-4 h-4 mr-2" /> Back</Button>
            </motion.div>
          )
        }

        {/* 4. Feelings */}
        {
          step === 4 && (
            <motion.div key="4" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="w-full space-y-4 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">How do you feel about starting?</h1>
              <div className="flex flex-col gap-3">
                {FEELINGS.map(f => (
                  <Button key={f.id} variant="ghost" className={cn("h-16 justify-start text-lg px-6 border transition-all duration-300 backdrop-blur-sm",
                    formData.feeling === f.id
                      ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5 scale-[1.02]"
                      : "bg-white/60 border-slate-200 text-slate-700 hover:bg-white/80 hover:border-slate-300 hover:text-slate-900 dark:bg-white/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10 dark:hover:border-white/20 dark:hover:text-white"
                  )} onClick={() => { updateField('feeling', f.id); nextStep(); }}>
                    {f.label}
                  </Button>
                ))}
              </div>
              <Button variant="ghost" onClick={prevStep} className="mt-4"><ChevronLeft className="w-4 h-4 mr-2" /> Back</Button>
            </motion.div>
          )
        }

        {/* 5. Challenges */}
        {
          step === 5 && (
            <motion.div key="5" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="w-full space-y-4 text-center">
              <h1 className="text-2xl font-bold">Current challenges?</h1>
              <div className="flex flex-col gap-3">
                {CHALLENGES.map(c => {
                  const active = formData.challenges.includes(c.id);
                  return (
                    <div key={c.id} className={cn("flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm",
                      active
                        ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5 scale-[1.02]"
                        : "bg-white/60 border-slate-200 text-slate-700 hover:bg-white/80 hover:border-slate-300 hover:text-slate-900 dark:bg-white/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10 dark:hover:border-white/20 dark:hover:text-white"
                    )} onClick={() => toggleList('challenges', c.id)}>
                      <span className="flex-1 text-left font-medium text-lg">{c.label}</span>
                      <div className={cn("w-6 h-6 rounded-full border flex items-center justify-center transition-colors", active ? "bg-primary border-primary text-white" : "border-slate-300 dark:border-white/30")}>
                        {active && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={prevStep} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10"><ChevronLeft className="w-4 h-4 mr-2" /> Back</Button>
                <Button onClick={nextStep} className="px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold shadow-lg shadow-primary/20">Next <ChevronRight className="w-4 h-4 ml-2" /></Button>
              </div>
            </motion.div>
          )
        }

        {/* 6. Strategies */}
        {
          step === 6 && (
            <motion.div key="6" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="w-full space-y-4 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-2">How to stay on track?</h1>
              <div className="flex flex-col gap-3">
                {STRATEGIES.map(s => {
                  const active = formData.strategies.includes(s.id);
                  return (
                    <div key={s.id} className={cn("flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm",
                      active
                        ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5 scale-[1.02]"
                        : "bg-white/60 border-slate-200 text-slate-700 hover:bg-white/80 hover:border-slate-300 hover:text-slate-900 dark:bg-white/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10 dark:hover:border-white/20 dark:hover:text-white"
                    )} onClick={() => toggleList('strategies', s.id)}>
                      <span className="flex-1 text-left font-medium text-lg">{s.label}</span>
                      <div className={cn("w-6 h-6 rounded-full border flex items-center justify-center transition-colors", active ? "bg-primary border-primary text-white" : "border-slate-300 dark:border-white/30")}>
                        {active && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={prevStep} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10"><ChevronLeft className="w-4 h-4 mr-2" /> Back</Button>
                <Button onClick={nextStep} className="px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold shadow-lg shadow-primary/20">Next <ChevronRight className="w-4 h-4 ml-2" /></Button>
              </div>
            </motion.div>
          )
        }

        {/* 7. Height */}
        {
          step === 7 && (
            <motion.div key="7" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="w-full space-y-8 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">How tall are you?</h1>
                <p className="text-muted-foreground">Crucial for calculating ideal calorie intake.</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-6">
                {formData.heightUnit === 'cm' ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      className="text-3xl h-16 w-32 text-center"
                      placeholder="175"
                      value={formData.height}
                      onChange={(e) => updateField('height', e.target.value)}
                      autoFocus
                    />
                    <span className="text-xl font-bold">cm</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        className="text-3xl h-16 w-24 text-center"
                        placeholder="5"
                        value={formData.heightFt}
                        onChange={(e) => handleHeightFtIn(e.target.value, formData.heightIn)}
                        autoFocus
                      />
                      <span className="text-xl font-bold">ft</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        className="text-3xl h-16 w-24 text-center"
                        placeholder="9"
                        value={formData.heightIn}
                        onChange={(e) => handleHeightFtIn(formData.heightFt, e.target.value)}
                      />
                      <span className="text-xl font-bold">in</span>
                    </div>
                  </div>
                )}
                <div className="bg-secondary p-1 rounded-full inline-flex">
                  <Button
                    variant="ghost"
                    className={cn("rounded-full px-6", formData.heightUnit === 'cm' && "bg-white shadow-sm")}
                    onClick={() => updateField('heightUnit', 'cm')}>cm</Button>
                  <Button
                    variant="ghost"
                    className={cn("rounded-full px-6", formData.heightUnit === 'ft' && "bg-white shadow-sm")}
                    onClick={() => updateField('heightUnit', 'ft')}>ft/in</Button>
                </div>
              </div>
              <div className="flex justify-between pt-8">
                <Button variant="ghost" onClick={prevStep}><ChevronLeft className="w-4 h-4 mr-2" /> Back</Button>
                <Button onClick={nextStep} disabled={!formData.height || (formData.heightUnit === 'ft' && !formData.heightFt)} className="px-8 shadow-lg">Next <ChevronRight className="w-4 h-4 ml-2" /></Button>
              </div>
            </motion.div>
          )
        }

        {/* 8. Current Weight */}
        {
          step === 8 && (
            <motion.div key="8" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="w-full space-y-8 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">What's your current weight?</h1>
                <p className="text-muted-foreground">It's okay to guess. You can adjust later.</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    className="text-3xl h-16 w-40 text-center"
                    placeholder="70"
                    value={formData.weight}
                    onChange={(e) => updateField('weight', e.target.value)}
                    autoFocus
                  />
                  <span className="text-xl font-bold">{formData.weightUnit}</span>
                </div>
                <div className="bg-secondary p-1 rounded-full inline-flex">
                  <Button
                    variant="ghost"
                    className={cn("rounded-full px-6", formData.weightUnit === 'kg' && "bg-white shadow-sm")}
                    onClick={() => updateField('weightUnit', 'kg')}>kg</Button>
                  <Button
                    variant="ghost"
                    className={cn("rounded-full px-6", formData.weightUnit === 'lbs' && "bg-white shadow-sm")}
                    onClick={() => updateField('weightUnit', 'lbs')}>lb</Button>
                </div>
              </div>
              <div className="flex justify-between pt-8">
                <Button variant="ghost" onClick={prevStep}><ChevronLeft className="w-4 h-4 mr-2" /> Back</Button>
                <Button onClick={nextStep} disabled={!formData.weight} className="px-8 shadow-lg">Next <ChevronRight className="w-4 h-4 ml-2" /></Button>
              </div>
            </motion.div>
          )
        }

        {/* 9. Goal Weight */}
        {
          step === 9 && (
            <motion.div key="9" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="w-full space-y-8 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">What's your goal weight?</h1>
                <p className="text-muted-foreground">Important for creating a plan that works.</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    className="text-3xl h-16 w-40 text-center"
                    placeholder="65"
                    value={formData.goalWeight}
                    onChange={(e) => updateField('goalWeight', e.target.value)}
                    autoFocus
                  />
                  <span className="text-xl font-bold">{formData.goalWeightUnit}</span>
                </div>
                <div className="bg-secondary p-1 rounded-full inline-flex">
                  <Button
                    variant="ghost"
                    className={cn("rounded-full px-6", formData.goalWeightUnit === 'kg' && "bg-white shadow-sm")}
                    onClick={() => updateField('goalWeightUnit', 'kg')}>kg</Button>
                  <Button
                    variant="ghost"
                    className={cn("rounded-full px-6", formData.goalWeightUnit === 'lbs' && "bg-white shadow-sm")}
                    onClick={() => updateField('goalWeightUnit', 'lbs')}>lb</Button>
                </div>
              </div>
              <div className="flex justify-between pt-8">
                <Button variant="ghost" onClick={prevStep}><ChevronLeft className="w-4 h-4 mr-2" /> Back</Button>
                <Button onClick={nextStep} disabled={!formData.goalWeight} className="px-8 shadow-lg">Next <ChevronRight className="w-4 h-4 ml-2" /></Button>
              </div>
            </motion.div>
          )
        }

        {/* 10. Birthday */}
        {
          step === 10 && (
            <motion.div key="10" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="w-full space-y-8 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">When is your birthday?</h1>
                <p className="text-muted-foreground">We need your age to accurately calculate your daily calorie goal.</p>
              </div>
              <div className="flex justify-center gap-2">
                {/* Month */}
                <select className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.birthMonth} onChange={(e) => updateField('birthMonth', e.target.value)}>
                  <option value="" disabled>Month</option>
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                {/* Day */}
                <select className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.birthDay} onChange={(e) => updateField('birthDay', e.target.value)}>
                  <option value="" disabled>Day</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {/* Year */}
                <select className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.birthYear} onChange={(e) => updateField('birthYear', e.target.value)}>
                  <option value="" disabled>Year</option>
                  {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="flex justify-between pt-8">
                <Button variant="ghost" onClick={prevStep}><ChevronLeft className="w-4 h-4 mr-2" /> Back</Button>
                <Button onClick={nextStep} disabled={!formData.birthYear || !formData.birthMonth || !formData.birthDay} className="px-8 shadow-lg">Next <ChevronRight className="w-4 h-4 ml-2" /></Button>
              </div>
            </motion.div>
          )
        }

        {/* 11. Benefits Animation */}
        {
          step === 11 && (
            <motion.div key="11" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="w-full space-y-8 text-center py-10">
              <div className="relative h-32 flex justify-center items-center gap-8">
                <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 2 }}><Carrot className="w-12 h-12 text-orange-500" /></motion.div>
                <motion.div animate={{ y: [0, -30, 0] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.2 }}><Apple className="w-16 h-16 text-red-500" /></motion.div>
                <motion.div animate={{ y: [0, -25, 0] }} transition={{ repeat: Infinity, duration: 2.2, delay: 0.5 }}><div className="text-4xl">🥦</div></motion.div>
              </div>
              <div className="space-y-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  You'll see positive effects...
                </h1>
                <div className="space-y-4 max-w-sm mx-auto text-left">
                  {["Stronger immune system", "Improved energy levels", "Reduced stress", "Better Sleep"].map((text, i) => (
                    <motion.div
                      key={text}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.8 }}
                      className="flex items-center gap-3 text-lg font-medium"
                    >
                      <div className="p-1 rounded-full bg-blue-100 text-primary"><Check className="w-4 h-4" /></div>
                      {text}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )
        }

        {/* 12. Activity */}
        {
          step === 12 && (
            <motion.div key="12" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="w-full space-y-4 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">Activity Level</h1>
              <div className="flex flex-col gap-3">
                {[
                  { id: "sedentary", label: "Sedentary", desc: "Desk job, little exercise" },
                  { id: "lightly-active", label: "Lightly Active", desc: "1-3 days/week exercise" },
                  { id: "moderately-active", label: "Moderately Active", desc: "3-5 days/week" },
                  { id: "very-active", label: "Very Active", desc: "6-7 days/week hard exercise" }
                ].map(a => (
                  <div key={a.id} className={cn("text-left p-4 border rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm group",
                    formData.activityLevel === a.id
                      ? "bg-primary/10 border-primary shadow-lg shadow-primary/5 scale-[1.02]"
                      : "bg-white/60 border-slate-200 hover:bg-white/80 hover:border-slate-300 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20"
                  )} onClick={() => { updateField('activityLevel', a.id); nextStep(); }}>
                    <div className={cn("font-bold text-lg mb-1 transition-colors", formData.activityLevel === a.id ? "text-primary" : "text-slate-900 dark:text-white")}>{a.label}</div>
                    <div className={cn("text-sm transition-colors", formData.activityLevel === a.id ? "text-primary/70" : "text-slate-600 dark:text-white/60")}>{a.desc}</div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" onClick={prevStep} className="mt-4 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10"><ChevronLeft className="w-4 h-4 mr-2" /> Back</Button>
            </motion.div>
          )
        }

        {/* 13. Diet */}
        {
          step === 13 && (
            <motion.div key="13" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="w-full space-y-4 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">Diet Preferences</h1>
              <div className="grid grid-cols-2 gap-3">
                {["Anything", "Vegetarian", "Vegan", "Paleo", "Keto", "Gluten Free"].map(d => (
                  <div key={d} className={cn("p-4 border rounded-xl cursor-pointer font-medium transition-all duration-300 backdrop-blur-sm flex items-center justify-center text-center h-24",
                    formData.dietType === d
                      ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5 scale-[1.02]"
                      : "bg-white/60 border-slate-200 text-slate-800 hover:bg-white/80 hover:border-slate-300 hover:text-slate-900 dark:bg-white/5 dark:border-white/10 dark:text-white/80 dark:hover:bg-white/10 dark:hover:border-white/20 dark:hover:text-white"
                  )} onClick={() => { updateField('dietType', d); nextStep(); }}>
                    {d}
                  </div>
                ))}
              </div>
              <Button variant="ghost" onClick={prevStep} className="mt-4 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10"><ChevronLeft className="w-4 h-4 mr-2" /> Back</Button>
            </motion.div>
          )
        }

        {/* 14. Habits */}
        {
          step === 14 && (
            <motion.div key="14" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="w-full space-y-6 text-center">
              <h1 className="text-2xl font-bold">Final Touches</h1>
              <Card className="border-2 text-left">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <Label className="mb-3 block">Daily Meals: {formData.mealFrequency}</Label>
                    <div className="flex gap-2">
                      {["3", "4", "5", "6"].map(n => (
                        <Button key={n} variant={formData.mealFrequency === n ? "default" : "outline"} className="flex-1" onClick={() => updateField("mealFrequency", n)}>{n}</Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="mb-3 block">Water Goal: {formData.waterIntake}L</Label>
                    <Input type="range" min="1.5" max="5" step="0.5" value={formData.waterIntake} onChange={e => updateField("waterIntake", e.target.value)} />
                  </div>
                  <div>
                    <Label className="mb-3 block">Allergies (Optional)</Label>
                    <Input placeholder="Peanuts, Shellfish..." value={formData.foodAllergies} onChange={e => updateField("foodAllergies", e.target.value)} />
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3">
                <Button onClick={submitForm} size="lg" className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 shadow-xl">Create My Plan</Button>
                <Button variant="ghost" onClick={prevStep}>Back</Button>
              </div>
            </motion.div>
          )
        }

        {/* 15. Loading */}
        {
          step === 15 && (
            <motion.div key="15" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="w-full flex flex-col items-center justify-center space-y-8 py-12">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-secondary rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
              </div>
              <h2 className="text-2xl font-bold animate-pulse text-white">Generating your plan...</h2>
            </motion.div>
          )
        }

        {/* 100. Auth Gate */}
        {
          step === 100 && (
            <motion.div key="100" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="w-full space-y-6 text-center">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl">
                <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Your Plan is Ready! 🎉</h1>
                <p className="text-white/70 mb-6">Create a free account to view your personalized plan and save your progress.</p>

                <div className="space-y-4 text-left">
                  {authMode === 'signup' && (
                    <div>
                      <Label className="text-white">Name</Label>
                      <Input value={authData.name} onChange={e => setAuthData({ ...authData, name: e.target.value })} className="bg-black/20 border-white/10 text-white" placeholder="John Doe" />
                    </div>
                  )}
                  <div>
                    <Label className="text-white">Email</Label>
                    <Input value={authData.email} onChange={e => setAuthData({ ...authData, email: e.target.value })} className="bg-black/20 border-white/10 text-white" placeholder="john@example.com" />
                  </div>
                  <div>
                    <Label className="text-white">Password</Label>
                    <Input type="password" value={authData.password} onChange={e => setAuthData({ ...authData, password: e.target.value })} className="bg-black/20 border-white/10 text-white" placeholder="••••••••" />
                  </div>

                  <Button onClick={handleAuth} className="w-full h-12 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
                    {isLoading ? "Signing in..." : (authMode === 'signup' ? "Create Account & View Plan" : "Login & View Plan")}
                  </Button>
                </div>

                <div className="mt-6 text-sm text-white/50">
                  {authMode === 'signup' ? "Already have an account? " : "Don't have an account? "}
                  <button onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')} className="text-primary hover:underline font-bold">
                    {authMode === 'signup' ? "Login" : "Sign Up"}
                  </button>
                </div>
              </div>
            </motion.div>
          )
        }

      </AnimatePresence >

      {
        step < 15 && step !== 100 && (
          <div className="w-full max-w-md px-4 mt-8">
            {/* Progress Bar content */}
            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
              <motion.div className="bg-primary h-full" initial={{ width: 0 }} animate={{ width: `${(step / 15) * 100}%` }} transition={{ duration: 0.3 }} />
            </div>
          </div>
        )
      }
    </div >
  );
}
