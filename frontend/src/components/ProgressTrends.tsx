
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { analyticsService } from '@/services/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import CustomTooltip from '@/components/ui/charts/CustomTooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface DayMeals {
  breakfast: Meal | null;
  lunch: Meal | null;
  dinner: Meal | null;
}

interface WeightEntry {
  date: string;
  weight: number;
  target: number;
  bodyFat: number;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ProgressTrends = () => {
  const { user } = useAuth();
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'calories' | 'macros'>('weight');
  const [selectedRange, setSelectedRange] = useState<'day' | 'month' | 'quarter'>('day');
  const [trendData, setTrendData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Weight Log State
  const [isWeightDialogOpen, setIsWeightDialogOpen] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchData = async () => {
    setIsLoading(true);
    // setTrendData(null); // Keep previous data while loading to avoid flicker if desired, but let's follow pattern

    await new Promise(resolve => setTimeout(resolve, 400));

    // Load Week Meals from Backend
    let weekMeals: Record<string, DayMeals> = {};
    const savedProfile = localStorage.getItem('userProfile');
    const userProfile = user || (savedProfile ? JSON.parse(savedProfile) : null);

    // Default to local storage
    const savedWeekMeals = localStorage.getItem('weekMeals');
    if (savedWeekMeals) {
      try { weekMeals = JSON.parse(savedWeekMeals); } catch (e) { }
    }

    if (user?.id) {
      try {
        const dbResponse = await analyticsService.getPlan(user.id);
        if (dbResponse && dbResponse.plan_data) {
          weekMeals = dbResponse.plan_data;
        }
      } catch (error) {
        console.warn("Failed to load cloud plan for trends, using local", error);
      }
    }

    const targetCalories = userProfile?.nutrition?.calories || 2000;

    // Load Weight Entries from Backend
    let weightEntries: WeightEntry[] = [];
    if (user?.id && selectedMetric === 'weight') {
      try {
        const history = await analyticsService.getHistory(user.id, 90);
        // Map backend history to WeightEntry format
        // Map backend history to WeightEntry format
        // Don't hardcode bodyFat to 0, use undefined if missing so chart ignores it
        weightEntries = history.map((h: any) => ({
          date: h.date,
          weight: h.weight,
          target: 70, // Mock target or fetch from profile
          bodyFat: h.bodyFat // Pass undefined if not present
        })).filter((w: any) => w.weight); // Only include entries with weight
      } catch (error) {
        console.error("Failed to load history", error);
        toast({ title: "Error", description: "Failed to load progress history.", variant: "destructive" });
      }
    } else {
      // Fallback to local storage if no user or just for consistency with old behavior? 
      // Let's rely on backend if user exists.
      const savedWeights = localStorage.getItem('weightEntries');
      if (savedWeights) weightEntries = JSON.parse(savedWeights);
    }

    // Sort weight entries by date
    weightEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let data: any = {};
    let stats: any = {
      weight: null,
      calories: null,
      macros: null,
    };

    // CALORIES & MACROS
    const dailyAggregates = daysOfWeek.map(day => {
      const dayMeals = weekMeals[day] || { breakfast: null, lunch: null, dinner: null };
      const meals = [dayMeals.breakfast, dayMeals.lunch, dayMeals.dinner].filter(Boolean) as Meal[];
      const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
      const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);
      const totalCarbs = meals.reduce((sum, m) => sum + m.carbs, 0);
      const totalFats = meals.reduce((sum, m) => sum + m.fats, 0);

      return {
        date: day.substring(0, 3), // Mon, Tue, etc.
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fats: totalFats,
      };
    });

    if (selectedMetric === 'calories') {
      data.caloriesTrend = dailyAggregates.map(d => ({
        ...d,
        // Mocking 'burned' calories for now as we don't track activity yet
        burned: Math.round(d.calories * 0.25),
        target: targetCalories,
      }));
      const avgWeeklyCalories = dailyAggregates.reduce((sum, d) => sum + d.calories, 0) / 7;
      stats.calories = {
        avgWeekly: Math.round(avgWeeklyCalories),
        trend: avgWeeklyCalories > targetCalories ? 'up' : 'down',
        consistency: 92,
      };
    }

    if (selectedMetric === 'macros') {
      data.macrosTrend = dailyAggregates.map(d => ({
        date: d.date,
        protein: d.protein,
        carbs: d.carbs,
        fats: d.fats,
      }));
    }

    // WEIGHT
    if (selectedMetric === 'weight') {
      let filtered = weightEntries;
      if (selectedRange === 'day') {
        filtered = weightEntries.slice(-7); // last 7 entries (approx week)
      } else if (selectedRange === 'month') {
        filtered = weightEntries.slice(-30);
      } else if (selectedRange === 'quarter') {
        filtered = weightEntries.slice(-90);
      }

      data.weightTrend = filtered;
    }

    setTrendData({ ...data, progressStats: stats });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedMetric, selectedRange]);

  const handleAddWeight = async () => {
    if (!newWeight || !newDate) {
      toast({ title: "Error", description: "Please enter both weight and date.", variant: "destructive" });
      return;
    }

    if (user?.id) {
      try {
        await analyticsService.logDailyStats({
          user_id: user.id,
          date: newDate,
          weight: parseFloat(newWeight)
        });
        toast({ title: "Weight Logged", description: "Your progress has been saved to the cloud." });
        setIsWeightDialogOpen(false);
        setNewWeight('');
        fetchData(); // Refresh chart
      } catch (error) {
        toast({ title: "Error", description: "Failed to save weight entry.", variant: "destructive" });
      }
    } else {
      // Fallback to local storage
      const savedWeights = localStorage.getItem('weightEntries');
      const weightEntries: WeightEntry[] = savedWeights ? JSON.parse(savedWeights) : [];

      const newEntry: WeightEntry = {
        date: newDate,
        weight: parseFloat(newWeight),
        target: 70, // Mock target, ideally from profile
      } as WeightEntry;

      // Check if entry for date exists and update it, else add new
      const existingIndex = weightEntries.findIndex(e => e.date === newDate);
      if (existingIndex >= 0) {
        weightEntries[existingIndex] = newEntry;
      } else {
        weightEntries.push(newEntry);
      }

      localStorage.setItem('weightEntries', JSON.stringify(weightEntries));

      toast({ title: "Weight Logged (Local)", description: "Your progress has been updated locally." });
      setIsWeightDialogOpen(false);
      setNewWeight('');
      fetchData(); // Refresh chart
    }
  };

  const weightTrend = trendData?.weightTrend || [];
  const caloriesTrend = trendData?.caloriesTrend || [];
  const macrosTrend = trendData?.macrosTrend || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Progress Trends</h2>
          <p className="text-gray-600">Track your journey over time</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isWeightDialogOpen} onOpenChange={setIsWeightDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="w-4 h-4" /> Log Weight
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Weight Entry</DialogTitle>
                <DialogDescription>
                  Add a new weight entry to track your progress.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="weight" className="text-right">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddWeight}>Save Entry</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Select value={selectedRange} onValueChange={(val: any) => setSelectedRange(val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 7 Entries</SelectItem>
              <SelectItem value="month">Last 30 Entries</SelectItem>
              <SelectItem value="quarter">Last 90 Entries</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={selectedMetric} onValueChange={(val) => setSelectedMetric(val as any)}>
        <TabsList>
          <TabsTrigger value="weight">Weight & Body Composition</TabsTrigger>
          <TabsTrigger value="calories">Calories & Energy</TabsTrigger>
          <TabsTrigger value="macros">Macronutrients</TabsTrigger>
        </TabsList>

        {/* WEIGHT TAB */}
        <TabsContent value="weight">
          {!isLoading && weightTrend.length > 0 ? (
            <Card>
              <CardHeader><CardTitle>Weight Progress</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weightTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: 'currentColor', fontSize: 12 }}
                      tickMargin={8}
                      tickLine={false}
                      axisLine={false}
                      padding={{ left: 16, right: 16 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="weight" stroke="#10B981" animationDuration={500} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="target" stroke="#3B82F6" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="bodyFat" stroke="#F59E0B" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                <p>No weight data available yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* CALORIES TAB */}
        <TabsContent value="calories">
          {!isLoading && caloriesTrend.length > 0 ? (
            <Card>
              <CardHeader><CardTitle>Calories vs Target</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={caloriesTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: 'currentColor', fontSize: 12 }}
                      tickMargin={8}
                      tickLine={false}
                      axisLine={false}
                      padding={{ left: 16, right: 16 }}
                    />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area type="monotone" dataKey="calories" stroke="#10B981" fill="#10B981" />
                    <Line type="monotone" dataKey="target" stroke="#3B82F6" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : <p>No calorie data yet.</p>}
        </TabsContent>

        {/* MACROS TAB */}
        <TabsContent value="macros">
          {!isLoading && macrosTrend.length > 0 ? (
            <Card>
              <CardHeader><CardTitle>Macronutrient Trends</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={macrosTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: 'currentColor', fontSize: 12 }}
                      tickMargin={8}
                      tickLine={false}
                      axisLine={false}
                      padding={{ left: 16, right: 16 }}
                    />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="protein" stroke="#10B981" />
                    <Line type="monotone" dataKey="carbs" stroke="#3B82F6" />
                    <Line type="monotone" dataKey="fats" stroke="#8B5CF6" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : <p>No macro data yet.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressTrends;
