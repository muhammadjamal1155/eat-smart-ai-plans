
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

interface NutritionChartProps {
  type: 'line' | 'bar';
  data: any[];
  title: string;
}

const NutritionChart = ({ type, data, title }: NutritionChartProps) => {
  const renderChart = () => {
    if (type === 'line') {
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="calories" stroke="#10B981" strokeWidth={2} />
          <Line type="monotone" dataKey="protein" stroke="#3B82F6" strokeWidth={2} />
        </LineChart>
      );
    }
    
    return (
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nutrient" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="current" fill="#10B981" />
        <Bar dataKey="target" fill="#E5E7EB" />
      </BarChart>
    );
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionChart;
