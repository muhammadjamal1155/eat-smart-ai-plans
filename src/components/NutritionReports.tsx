import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Award, Loader2 } from "lucide-react";
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
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setReportData(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 800)); // simulate API delay

        const savedWeekMeals = localStorage.getItem("weekMeals");
        const weekMeals: Record<string, DayMeals> = savedWeekMeals
          ? JSON.parse(savedWeekMeals)
          : {};

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
            (totalCalories / 2000) * 100 + (totalProtein / 120) * 100
          );

          return {
            day,
            calories: totalCalories,
            protein: totalProtein,
            carbs: totalCarbs,
            fats: totalFats,
            score: Math.round(score / 2),
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
          const avg = {
            calories: Math.round(totals.calories / arr.length),
            protein: Math.round(totals.protein / arr.length),
            carbs: Math.round(totals.carbs / arr.length),
            fats: Math.round(totals.fats / arr.length),
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
        let data;
        if (selectedPeriod === "week") {
          const { avg, macroDistribution } = aggregate(dailyBreakdown);
          data = {
            period: "This Week",
            summary: {
              avgCalories: avg.calories,
              targetCalories: 2000,
              avgProtein: avg.protein,
              targetProtein: 120,
              avgCarbs: avg.carbs,
              targetCarbs: 250,
              avgFats: avg.fats,
              targetFats: 80,
              waterIntake: 85,
              sleepQuality: 78,
              workoutDays: 5,
              targetWorkouts: 5,
            },
            dailyBreakdown,
            macroDistribution,
          };
        }

        if (selectedPeriod === "month") {
          const { avg, macroDistribution } = aggregate(dailyBreakdown);
          data = {
            period: "This Month",
            summary: {
              avgCalories: avg.calories,
              targetCalories: 2000,
              avgProtein: avg.protein,
              targetProtein: 120,
              avgCarbs: avg.carbs,
              targetCarbs: 250,
              avgFats: avg.fats,
              targetFats: 80,
              waterIntake: 90,
              sleepQuality: 80,
              workoutDays: 20,
              targetWorkouts: 22,
            },
            dailyBreakdown,
            macroDistribution,
          };
        }

        if (selectedPeriod === "quarter") {
          const { avg, macroDistribution } = aggregate(dailyBreakdown);
          data = {
            period: "This Quarter",
            summary: {
              avgCalories: avg.calories,
              targetCalories: 2000,
              avgProtein: avg.protein,
              targetProtein: 120,
              avgCarbs: avg.carbs,
              targetCarbs: 250,
              avgFats: avg.fats,
              targetFats: 80,
              waterIntake: 88,
              sleepQuality: 79,
              workoutDays: 60,
              targetWorkouts: 65,
            },
            dailyBreakdown,
            macroDistribution,
          };
        }

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
  }, [selectedPeriod]);

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
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Avg Calories</p>
                <p className="text-2xl font-bold">{reportData.summary.avgCalories}</p>
                <p className="text-xs text-gray-500">Target: {reportData.summary.targetCalories}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Avg Protein</p>
                <p className="text-2xl font-bold">{reportData.summary.avgProtein}g</p>
                <p className="text-xs text-gray-500">Target: {reportData.summary.targetProtein}g</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Water Intake</p>
                <p className="text-2xl font-bold">{reportData.summary.waterIntake}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">Workout Days</p>
                  <p className="text-2xl font-bold">
                    {reportData.summary.workoutDays}/{reportData.summary.targetWorkouts}
                  </p>
                </div>
                <Award className="w-6 h-6 text-green-600" />
              </CardContent>
            </Card>
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
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
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
