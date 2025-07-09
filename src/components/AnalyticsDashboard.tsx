
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, TrendingUp, Target } from 'lucide-react';
import NutritionReports from './NutritionReports';
import ProgressTrends from './ProgressTrends';
import GoalTracking from './GoalTracking';

const AnalyticsDashboard = () => {
  return (
    <section id="analytics" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            Advanced Analytics
          </h2>
          <p className="text-xl text-gray-600">
            Comprehensive insights into your nutrition journey with detailed reports, trends, and goal tracking
          </p>
        </div>

        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              Nutrition Reports
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Progress Trends
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Goal Tracking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports">
            <NutritionReports />
          </TabsContent>

          <TabsContent value="trends">
            <ProgressTrends />
          </TabsContent>

          <TabsContent value="goals">
            <GoalTracking />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default AnalyticsDashboard;
