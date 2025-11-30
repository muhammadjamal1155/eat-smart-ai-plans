
import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import CustomTooltip from '@/components/ui/charts/CustomTooltip';
interface NutritionChartProps {
  type: 'line' | 'bar';
  data: Record<string, unknown>[];
  title: string;
}

const NutritionChart = ({ type, data, title }: NutritionChartProps) => {
  const allDataKeys = Object.keys(data[0] || {}).filter(key => key !== 'day' && key !== 'nutrient');
  const [visibleDataKeys, setVisibleDataKeys] = useState<string[]>([]);

  // Update visible keys when data loads for the first time
  useEffect(() => {
    if (visibleDataKeys.length === 0 && allDataKeys.length > 0) {
      setVisibleDataKeys(allDataKeys);
    }
  }, [data, allDataKeys.join(',')]); // Depend on data keys changing

  const handleCheckboxChange = useCallback((key: string) => {
    setVisibleDataKeys(prevKeys =>
      prevKeys.includes(key) ? prevKeys.filter(k => k !== key) : [...prevKeys, key]
    );
  }, []);

  const getStrokeColor = (key: string) => {
    switch (key) {
      case 'calories': return '#10B981';
      case 'protein': return '#3B82F6';
      case 'carbs': return '#FFC107'; // Example color
      case 'fats': return '#9C27B0'; // Example color
      case 'current': return '#10B981';
      case 'target': return '#E5E7EB';
      default: return '#8884d8';
    }
  };

  const renderChart = () => {
    if (type === 'line') {
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {visibleDataKeys.map(key => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={getStrokeColor(key)}
              strokeWidth={2}
              hide={!visibleDataKeys.includes(key)}
            />
          ))}
        </LineChart>
      );
    }

    return (
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nutrient" />
        <YAxis />
        <Tooltip />
        <Legend />
        {visibleDataKeys.map(key => (
          <Bar
            key={key}
            dataKey={key}
            fill={getStrokeColor(key)}
            hide={!visibleDataKeys.includes(key)}
          />
        ))}
      </BarChart>
    );
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4">
          {allDataKeys.map(key => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={`checkbox-${key}`}
                checked={visibleDataKeys.includes(key)}
                onCheckedChange={() => handleCheckboxChange(key)}
              />
              <Label htmlFor={`checkbox-${key}`} className="capitalize">
                {key}
              </Label>
            </div>
          ))}
        </div>
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
