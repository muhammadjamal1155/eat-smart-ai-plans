
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Download, TrendingUp, Target, Award } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { toast } from '@/hooks/use-toast';

const NutritionReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week');

  const weeklyReport = {
    period: 'This Week',
    summary: {
      avgCalories: 1750,
      targetCalories: 2000,
      avgProtein: 95,
      targetProtein: 120,
      avgCarbs: 185,
      targetCarbs: 250,
      avgFats: 68,
      targetFats: 80,
      waterIntake: 85, // percentage
      sleepQuality: 78, // percentage
      workoutDays: 5,
      targetWorkouts: 5
    },
    dailyBreakdown: [
      { day: 'Mon', calories: 1800, protein: 105, carbs: 180, fats: 65, score: 92 },
      { day: 'Tue', calories: 1650, protein: 88, carbs: 175, fats: 70, score: 85 },
      { day: 'Wed', calories: 1900, protein: 110, carbs: 200, fats: 75, score: 95 },
      { day: 'Thu', calories: 1700, protein: 90, carbs: 185, fats: 68, score: 88 },
      { day: 'Fri', calories: 1750, protein: 95, carbs: 190, fats: 65, score: 90 },
      { day: 'Sat', calories: 1850, protein: 100, carbs: 195, fats: 72, score: 93 },
      { day: 'Sun', calories: 1600, protein: 82, carbs: 170, fats: 60, score: 82 }
    ],
    macroDistribution: [
      { name: 'Protein', value: 25, color: '#10B981' },
      { name: 'Carbs', value: 45, color: '#3B82F6' },
      { name: 'Fats', value: 30, color: '#8B5CF6' }
    ],
    improvements: [
      { area: 'Protein Intake', current: 95, target: 120, improvement: 'Increase by 25g daily' },
      { area: 'Fiber', current: 18, target: 25, improvement: 'Add more vegetables and whole grains' },
      { area: 'Water Intake', current: 85, target: 100, improvement: 'Drink 2 more glasses daily' }
    ]
  };

  const handleDownloadReport = () => {
    toast({
      title: "Downloading Report",
      description: "Your detailed nutrition report is being generated...",
    });
  };

  const handleShareReport = () => {
    toast({
      title: "Share Report",
      description: "Report sharing functionality coming soon!",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nutrition Reports</h2>
          <p className="text-gray-600">Detailed analysis of your nutrition journey</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleShareReport} variant="outline">
            Share Report
          </Button>
          <Button onClick={handleDownloadReport} className="btn-primary">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)}>
        <TabsList>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="quarter">This Quarter</TabsTrigger>
        </TabsList>

        <TabsContent value="week" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Calories</p>
                    <p className="text-2xl font-bold">{weeklyReport.summary.avgCalories}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Target: {weeklyReport.summary.targetCalories}</p>
                    <Progress 
                      value={(weeklyReport.summary.avgCalories / weeklyReport.summary.targetCalories) * 100} 
                      className="w-16 h-2 mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Protein</p>
                    <p className="text-2xl font-bold">{weeklyReport.summary.avgProtein}g</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Target: {weeklyReport.summary.targetProtein}g</p>
                    <Progress 
                      value={(weeklyReport.summary.avgProtein / weeklyReport.summary.targetProtein) * 100} 
                      className="w-16 h-2 mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Water Intake</p>
                    <p className="text-2xl font-bold">{weeklyReport.summary.waterIntake}%</p>
                  </div>
                  <div className="text-right">
                    <Badge className={weeklyReport.summary.waterIntake >= 90 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {weeklyReport.summary.waterIntake >= 90 ? 'Excellent' : 'Good'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Workout Days</p>
                    <p className="text-2xl font-bold">{weeklyReport.summary.workoutDays}/{weeklyReport.summary.targetWorkouts}</p>
                  </div>
                  <div className="text-right">
                    <Award className={`w-6 h-6 ${weeklyReport.summary.workoutDays >= weeklyReport.summary.targetWorkouts ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Nutrition Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyReport.dailyBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Macro Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={weeklyReport.macroDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {weeklyReport.macroDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Improvements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-health-600" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyReport.improvements.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.area}</h4>
                      <p className="text-sm text-gray-600">{item.improvement}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Current: {item.current} | Target: {item.target}
                      </p>
                      <Progress 
                        value={(item.current / item.target) * 100} 
                        className="w-24 h-2 mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month">
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Report Coming Soon</h3>
              <p className="text-gray-600">Monthly analytics will be available with more usage data.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quarter">
          <Card>
            <CardContent className="p-8 text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quarterly Report Coming Soon</h3>
              <p className="text-gray-600">Quarterly trends and insights will be available with extended usage.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NutritionReports;
