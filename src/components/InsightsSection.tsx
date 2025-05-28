
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { BarChart as BarChartIcon, TrendingUp, Target } from 'lucide-react';

const InsightsSection = () => {
  const weightData = [
    { week: 'Week 1', weight: 70.5 },
    { week: 'Week 2', weight: 70.1 },
    { week: 'Week 3', weight: 69.8 },
    { week: 'Week 4', weight: 69.2 },
    { week: 'Week 5', weight: 68.9 },
    { week: 'Week 6', weight: 68.5 },
  ];

  const macroData = [
    { name: 'Protein', value: 25, color: '#22c55e' },
    { name: 'Carbs', value: 45, color: '#3b82f6' },
    { name: 'Fats', value: 30, color: '#f59e0b' },
  ];

  const calorieData = [
    { day: 'Mon', target: 1800, actual: 1650 },
    { day: 'Tue', target: 1800, actual: 1720 },
    { day: 'Wed', target: 1800, actual: 1680 },
    { day: 'Thu', target: 1800, actual: 1750 },
    { day: 'Fri', target: 1800, actual: 1680 },
    { day: 'Sat', target: 1800, actual: 1820 },
    { day: 'Sun', target: 1800, actual: 1700 },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            Your Progress Insights
          </h2>
          <p className="text-xl text-gray-600">
            Visualize your journey with detailed analytics and trends
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Weight Progress Chart */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-health-600" />
                <span>Weight Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-between items-center mt-4 p-4 bg-health-50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-health-600">-2.0 kg</div>
                  <div className="text-sm text-gray-600">Total Loss</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-health-600">0.33 kg</div>
                  <div className="text-sm text-gray-600">Avg/Week</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-health-600">5.5 kg</div>
                  <div className="text-sm text-gray-600">To Goal</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Macro Distribution */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-health-600" />
                <span>Macro Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {macroData.map((macro) => (
                  <div key={macro.name} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div 
                      className="w-4 h-4 rounded mx-auto mb-1"
                      style={{ backgroundColor: macro.color }}
                    ></div>
                    <div className="font-semibold text-gray-900">{macro.value}%</div>
                    <div className="text-sm text-gray-600">{macro.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Calorie Intake */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChartIcon className="w-5 h-5 text-health-600" />
              <span>Weekly Calorie Intake vs Target</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={calorieData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Bar dataKey="target" fill="#e5e7eb" name="Target" />
                <Bar dataKey="actual" fill="#22c55e" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-8 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span className="text-sm text-gray-600">Target</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-health-500 rounded"></div>
                <span className="text-sm text-gray-600">Actual</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          {[
            { label: 'Consistency Rate', value: '85%', change: '+5%', color: 'text-health-600' },
            { label: 'Avg Daily Calories', value: '1,700', change: '-100', color: 'text-blue-600' },
            { label: 'Water Intake', value: '2.1L', change: '+0.3L', color: 'text-blue-400' },
            { label: 'Exercise Days', value: '5/7', change: '+1', color: 'text-purple-600' },
          ].map((metric) => (
            <Card key={metric.label} className="shadow-lg border-0 card-hover">
              <CardContent className="p-6 text-center space-y-2">
                <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
                <div className="text-xs text-health-600">{metric.change} this week</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InsightsSection;
