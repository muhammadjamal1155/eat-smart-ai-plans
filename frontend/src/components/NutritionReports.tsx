
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Award,
  Flame,
  Droplet,
  Moon,
  Dumbbell,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "@/hooks/use-toast";
import CustomTooltip from "@/components/ui/charts/CustomTooltip";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { analyticsService } from "@/services/analytics";
import { useAuth } from "@/contexts/AuthContext";

// ---------- Types ----------
interface Meal {
  id: string;
  name: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  cookTime: number;
  servings: number;
  tags: string[];
  ingredients: string[];
}

interface DayMeals {
  breakfast: Meal | null;
  lunch: Meal | null;
  dinner: Meal | null;
}

type Period = "week" | "month" | "quarter";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const NutritionReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("week");
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // ---------- Fetch Report Data ----------
  const { user } = useAuth();

  // ---------- Fetch Report Data ----------
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setIsLoading(true);
      setReportData(null);

      try {
        // Fetch real plan data from backend
        let weekMeals: Record<string, DayMeals> = {};

        // Try to load from Local Storage first as a fallback/default
        const localMeals = localStorage.getItem("weekMeals");
        if (localMeals) {
          try {
            weekMeals = JSON.parse(localMeals);
          } catch (e) { console.error("Error parsing local meals", e); }
        }

        try {
          const dbResponse = await analyticsService.getPlan(user.id);
          // If backend has data, overwrite the local fallback
          if (dbResponse && dbResponse.plan_data) {
            weekMeals = dbResponse.plan_data;
          }
        } catch (err) {
          console.warn("Cloud plan fetch failed, using local data if available", err);
        }

        // Default targets from profile using optional chaining on the user object
        const targets = {
          calories: user?.nutrition?.calories || 2000,
          protein: user?.nutrition?.protein || 150,
          carbs: user?.nutrition?.carbs || 250,
          fats: user?.nutrition?.fats || 70,
          water: user?.lifestyle?.hydrationGoal || 2.5,
          workouts: 5
        };


        // Build weekly breakdown
        const dailyBreakdown = daysOfWeek.map((day) => {
          const dayMeals =
            weekMeals[day] || { breakfast: null, lunch: null, dinner: null };
          const meals = [
            dayMeals.breakfast,
            dayMeals.lunch,
            dayMeals.dinner,
          ].filter(Boolean) as Meal[];

          const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
          const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);
          const totalCarbs = meals.reduce((sum, m) => sum + m.carbs, 0);
          const totalFats = meals.reduce((sum, m) => sum + m.fats, 0);

          const score = Math.min(
            100,
            (totalCalories / targets.calories) * 100
          );

          return {
            day,
            calories: totalCalories,
            protein: totalProtein,
            carbs: totalCarbs,
            fats: totalFats,
            score: Math.round(score),
          };
        });

        // Aggregate helper
        const aggregate = (arr: any[]) => {
          const totals = arr.reduce(
            (acc, d) => {
              acc.calories += d.calories;
              acc.protein += d.protein;
              acc.carbs += d.carbs;
              acc.fats += d.fats;
              return acc;
            },
            { calories: 0, protein: 0, carbs: 0, fats: 0 }
          );

          const count = arr.length || 1;

          const avg = {
            calories: Math.round(totals.calories / count),
            protein: Math.round(totals.protein / count),
            carbs: Math.round(totals.carbs / count),
            fats: Math.round(totals.fats / count),
          };
          const totalMacros = totals.protein + totals.carbs + totals.fats;
          const macroDistribution = [
            {
              name: "Protein",
              value:
                totalMacros > 0
                  ? Math.round((totals.protein / totalMacros) * 100)
                  : 0,
              color: "#10B981",
            },
            {
              name: "Carbs",
              value:
                totalMacros > 0
                  ? Math.round((totals.carbs / totalMacros) * 100)
                  : 0,
              color: "#3B82F6",
            },
            {
              name: "Fats",
              value:
                totalMacros > 0
                  ? Math.round((totals.fats / totalMacros) * 100)
                  : 0,
              color: "#8B5CF6",
            },
          ];
          return { totals, avg, macroDistribution };
        };

        // Build base data
        const { avg, macroDistribution } = aggregate(dailyBreakdown);

        const data = {
          period: selectedPeriod === 'week' ? "This Week" : selectedPeriod === 'month' ? "This Month" : "This Quarter",
          summary: {
            avgCalories: avg.calories,
            targetCalories: Math.round(targets.calories),
            avgProtein: avg.protein,
            targetProtein: Math.round(targets.protein),
            avgCarbs: avg.carbs,
            targetCarbs: Math.round(targets.carbs),
            avgFats: avg.fats,
            targetFats: Math.round(targets.fats),
            waterIntake: 85,
            sleepQuality: 78,
            workoutDays: 3,
            targetWorkouts: targets.workouts,
          },
          dailyBreakdown,
          macroDistribution,
        };

        setReportData(data);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to load nutrition report",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod, user]);

  // ---------- PDF Download ----------
  const handleDownloadReport = () => {
    if (!reportRef.current) return;
    setIsDownloading(true);

    html2canvas(reportRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("nutrition-report.pdf");
      setIsDownloading(false);
    });
  };

  return (
    <div className="space-y-6" ref={reportRef}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nutrition Reports</h2>
          <p className="text-gray-600">Detailed analysis of your nutrition journey</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={(val) => setSelectedPeriod(val as Period)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleDownloadReport}
            disabled={isDownloading || isLoading}
          >
            {isDownloading || isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Download PDF
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <p className="text-center py-10 text-gray-500">Loading...</p>
      ) : !reportData ? (
        <p className="text-center py-10 text-gray-500">No data available.</p>
      ) : (
        <>
          {/* Summary */}
          <div className="grid gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                key: "avgCalories",
                label: "Avg Calories",
                icon: Flame,
                formatter: (value: number) => value.toLocaleString(),
                targetKey: "targetCalories",
                targetSuffix: "",
              },
              {
                key: "avgProtein",
                label: "Avg Protein",
                formatter: (value: number) => `${value}g`,
                targetKey: "targetProtein",
                targetSuffix: "g",
              },
              {
                key: "avgCarbs",
                label: "Avg Carbs",
                formatter: (value: number) => `${value}g`,
                targetKey: "targetCarbs",
                targetSuffix: "g",
              },
              {
                key: "avgFats",
                label: "Avg Fats",
                formatter: (value: number) => `${value}g`,
                targetKey: "targetFats",
                targetSuffix: "g",
              },
              {
                key: "waterIntake",
                label: "Hydration",
                icon: Droplet,
                formatter: (value: number) => `${value}%`,
              },
              {
                key: "sleepQuality",
                label: "Sleep Quality",
                icon: Moon,
                formatter: (value: number) => `${value}%`,
              },
              {
                key: "workoutDays",
                label: "Workout Days",
                icon: Dumbbell,
                formatter: (_: number, summary: any) =>
                  `${summary.workoutDays ?? 0}/${summary.targetWorkouts ?? "—"}`,
              },
            ]
              .filter((item) => reportData.summary?.[item.key] !== undefined)
              .map((item) => {
                const IconComponent = item.icon ?? Award;
                const rawValue = reportData.summary[item.key];
                const displayValue = item.formatter
                  ? item.formatter(rawValue, reportData.summary)
                  : rawValue;
                const targetValue =
                  item.targetKey && reportData.summary[item.targetKey] !== undefined
                    ? `${reportData.summary[item.targetKey]}${item.targetSuffix ?? ""}`
                    : null;

                return (
                  <Card key={item.key} className="glass-panel shadow-soft">
                    <CardContent className="p-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="text-2xl font-bold text-foreground mt-1">{displayValue}</p>
                        {targetValue && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Target: {targetValue}
                          </p>
                        )}
                      </div>
                      {item.icon && (
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-forest-100 text-forest-600 dark:bg-forest-900/50 dark:text-forest-100">
                          <IconComponent className="h-5 w-5" />
                        </span>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportData.dailyBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="day"
                        tick={{ fill: 'currentColor', fontSize: 12 }}
                        tickMargin={8}
                        tickLine={false}
                        axisLine={false}
                        padding={{ left: 16, right: 16 }}
                        interval={0}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="score" fill="#10B981" barSize={40} />
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
                        data={reportData.macroDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {reportData.macroDistribution.map((entry: any, i: number) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default NutritionReports;
