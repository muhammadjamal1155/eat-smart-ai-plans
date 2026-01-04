
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, TrendingUp, Target, Brain } from 'lucide-react';
import NutritionReports from './NutritionReports';
import ProgressTrends from './ProgressTrends';
import GoalTracking from './GoalTracking';
import AICoach from './AICoach';
import DashboardSummary from './DashboardSummary';

const AnalyticsDashboard = () => {
  return (
    <section id="analytics" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-foreground">
            Advanced Analytics
          </h2>
          <p className="text-xl text-muted-foreground">
            Comprehensive insights into your nutrition journey with detailed reports, trends, and goal tracking
          </p>
        </div>

        <DashboardSummary />

        <Tabs defaultValue="coach" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-background/70 border border-border/60 backdrop-blur-sm">
            <TabsTrigger value="coach" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Coach
            </TabsTrigger>
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

          <TabsContent value="coach">
            <AICoach />
          </TabsContent>

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
