
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Minus, Calendar, Target } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';

const ProgressTrends = () => {
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'calories' | 'macros'>('weight');

  const weightTrend = [
    { date: '2024-01-01', weight: 75, target: 70, bodyFat: 18 },
    { date: '2024-01-08', weight: 74.5, target: 70, bodyFat: 17.8 },
    { date: '2024-01-15', weight: 74.2, target: 70, bodyFat: 17.5 },
    { date: '2024-01-22', weight: 73.8, target: 70, bodyFat: 17.2 },
    { date: '2024-01-29', weight: 73.5, target: 70, bodyFat: 17 },
    { date: '2024-02-05', weight: 73.2, target: 70, bodyFat: 16.8 },
    { date: '2024-02-12', weight: 72.8, target: 70, bodyFat: 16.5 },
    { date: '2024-02-19', weight: 72.5, target: 70, bodyFat: 16.3 },
    { date: '2024-02-26', weight: 72.2, target: 70, bodyFat: 16 },
    { date: '2024-03-05', weight: 71.8, target: 70, bodyFat: 15.8 },
    { date: '2024-03-12', weight: 71.5, target: 70, bodyFat: 15.5 },
    { date: '2024-03-19', weight: 71.2, target: 70, bodyFat: 15.2 }
  ];

  const caloriesTrend = [
    { date: '2024-01-01', calories: 1800, target: 1750, burned: 2200 },
    { date: '2024-01-08', calories: 1750, target: 1750, burned: 2180 },
    { date: '2024-01-15', calories: 1720, target: 1750, burned: 2150 },
    { date: '2024-01-22', calories: 1780, target: 1750, burned: 2200 },
    { date: '2024-01-29', calories: 1740, target: 1750, burned: 2170 },
    { date: '2024-02-05', calories: 1760, target: 1750, burned: 2190 },
    { date: '2024-02-12', calories: 1730, target: 1750, burned: 2160 },
    { date: '2024-02-19', calories: 1770, target: 1750, burned: 2180 },
    { date: '2024-02-26', calories: 1750, target: 1750, burned: 2170 },
    { date: '2024-03-05', calories: 1740, target: 1750, burned: 2160 },
    { date: '2024-03-12', calories: 1760, target: 1750, burned: 2180 },
    { date: '2024-03-19', calories: 1750, target: 1750, burned: 2170 }
  ];

  const macrosTrend = [
    { date: '2024-01-01', protein: 85, carbs: 180, fats: 65 },
    { date: '2024-01-08', protein: 90, carbs: 175, fats: 68 },
    { date: '2024-01-15', protein: 88, carbs: 185, fats: 62 },
    { date: '2024-01-22', protein: 95, carbs: 170, fats: 70 },
    { date: '2024-01-29', protein: 92, carbs: 180, fats: 66 },
    { date: '2024-02-05', protein: 98, carbs: 175, fats: 68 },
    { date: '2024-02-12', protein: 94, carbs: 185, fats: 64 },
    { date: '2024-02-19', protein: 100, carbs: 170, fats: 72 },
    { date: '2024-02-26', protein: 96, carbs: 180, fats: 68 },
    { date: '2024-03-05', protein: 102, carbs: 175, fats: 70 },
    { date: '2024-03-12', protein: 98, carbs: 185, fats: 66 },
    { date: '2024-03-19', protein: 105, carbs: 170, fats: 72 }
  ];

  const progressStats = {
    weight: {
      current: 71.2,
      start: 75,
      target: 70,
      change: -3.8,
      changePercent: -5.1,
      trend: 'down',
      timeToGoal: '4 weeks'
    },
    calories: {
      current: 1750,
      target: 1750,
      avgWeekly: 1748,
      consistency: 92,
      trend: 'stable'
    },
    macros: {
      protein: { current: 105, target: 120, trend: 'up', change: 20 },
      carbs: { current: 170, target: 180, trend: 'stable', change: -10 },
      fats: { current: 72, target: 80, trend: 'up', change: 7 }
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-100';
      case 'down': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Progress Trends</h2>
          <p className="text-gray-600">Track your journey over time</p>
        </div>
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Last 12 Weeks
        </Button>
      </div>

      <Tabs value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as 'weight' | 'calories' | 'macros')}>
        <TabsList>
          <TabsTrigger value="weight">Weight & Body Composition</TabsTrigger>
          <TabsTrigger value="calories">Calories & Energy</TabsTrigger>
          <TabsTrigger value="macros">Macronutrients</TabsTrigger>
        </TabsList>

        <TabsContent value="weight" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current Weight</p>
                    <p className="text-2xl font-bold">{progressStats.weight.current} kg</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getTrendColor(progressStats.weight.trend)}>
                      {getTrendIcon(progressStats.weight.trend)}
                      {progressStats.weight.change} kg
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{progressStats.weight.changePercent}% change</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Goal Progress</p>
                    <p className="text-2xl font-bold">{Math.round(((progressStats.weight.start - progressStats.weight.current) / (progressStats.weight.start - progressStats.weight.target)) * 100)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Remaining: {(progressStats.weight.current - progressStats.weight.target).toFixed(1)} kg</p>
                    <p className="text-xs text-gray-500">ETA: {progressStats.weight.timeToGoal}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Body Fat</p>
                    <p className="text-2xl font-bold">15.2%</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      -2.8%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Weight Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <Legend />
                    <Line type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} />
                    <Line type="monotone" dataKey="target" stroke="#EF4444" strokeDasharray="5 5" strokeWidth={2} />
                    <Line type="monotone" dataKey="bodyFat" stroke="#8B5CF6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calories" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Daily Average</p>
                    <p className="text-2xl font-bold">{progressStats.calories.avgWeekly}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getTrendColor(progressStats.calories.trend)}>
                      {getTrendIcon(progressStats.calories.trend)}
                      On Target
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Consistency</p>
                    <p className="text-2xl font-bold">{progressStats.calories.consistency}%</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Deficit</p>
                    <p className="text-2xl font-bold">420</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">cal/day</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Calories vs Target</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={caloriesTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                    <YAxis />
                    <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <Legend />
                    <Area type="monotone" dataKey="burned" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="calories" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    <Line type="monotone" dataKey="target" stroke="#3B82F6" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="macros" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Protein</p>
                    <p className="text-2xl font-bold">{progressStats.macros.protein.current}g</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getTrendColor(progressStats.macros.protein.trend)}>
                      {getTrendIcon(progressStats.macros.protein.trend)}
                      +{progressStats.macros.protein.change}g
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Carbs</p>
                    <p className="text-2xl font-bold">{progressStats.macros.carbs.current}g</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getTrendColor(progressStats.macros.carbs.trend)}>
                      {getTrendIcon(progressStats.macros.carbs.trend)}
                      {progressStats.macros.carbs.change}g
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Fats</p>
                    <p className="text-2xl font-bold">{progressStats.macros.fats.current}g</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getTrendColor(progressStats.macros.fats.trend)}>
                      {getTrendIcon(progressStats.macros.fats.trend)}
                      +{progressStats.macros.fats.change}g
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Macronutrient Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={macrosTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                    <YAxis />
                    <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <Legend />
                    <Line type="monotone" dataKey="protein" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="carbs" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="fats" stroke="#8B5CF6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressTrends;
