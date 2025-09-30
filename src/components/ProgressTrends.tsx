import { useState, useEffect } from 'react';
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

const ProgressTrends = () => {
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'calories' | 'macros'>('weight');
  const [selectedRange, setSelectedRange] = useState<'day' | 'month' | 'quarter'>('day');
  const [trendData, setTrendData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTrendData(null);

    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 400));

      const savedWeekMeals = localStorage.getItem('weekMeals');
      const weekMeals: Record<string, DayMeals> = savedWeekMeals ? JSON.parse(savedWeekMeals) : {};

      const savedWeights = localStorage.getItem('weightEntries');
      const weightEntries: WeightEntry[] = savedWeights ? JSON.parse(savedWeights) : [];

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
          date: day.substring(0, 3),
          calories: totalCalories,
          protein: totalProtein,
          carbs: totalCarbs,
          fats: totalFats,
        };
      });

      if (selectedMetric === 'calories') {
        data.caloriesTrend = dailyAggregates.map(d => ({
          ...d,
          burned: Math.round(d.calories * 0.25),
          target: 2000,
        }));
        const avgWeeklyCalories = dailyAggregates.reduce((sum, d) => sum + d.calories, 0) / 7;
        stats.calories = {
          avgWeekly: Math.round(avgWeeklyCalories),
          trend: avgWeeklyCalories > 2000 ? 'up' : 'down',
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
          filtered = weightEntries.slice(-7); // last 7 days
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

    fetchData();
  }, [selectedMetric, selectedRange]);

  const weightTrend = trendData?.weightTrend || [];
  const caloriesTrend = trendData?.caloriesTrend || [];
  const macrosTrend = trendData?.macrosTrend || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Progress Trends</h2>
          <p className="text-gray-600">Track your journey over time</p>
        </div>
        <Select value={selectedRange} onValueChange={(val: any) => setSelectedRange(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>
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
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="weight" stroke="#10B981" />
                    <Line type="monotone" dataKey="target" stroke="#3B82F6" />
                    <Line type="monotone" dataKey="bodyFat" stroke="#F59E0B" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : <p>No weight data yet.</p>}
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
                    <XAxis dataKey="date" />
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
                    <XAxis dataKey="date" />
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
