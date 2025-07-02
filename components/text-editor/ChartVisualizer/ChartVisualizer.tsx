'use client';

import { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

type ChartType = 'bar' | 'line' | 'pie';

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

const COLORS = ['#6366F1', '#A78BFA', '#818CF8', '#10B981', '#3B82F6', '#F472B6'];

// Consolidated chart styles
const CHART_STYLE = {
  tooltip: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '8px'
  },
  grid: {
    strokeDasharray: '3 3',
    stroke: '#E5E7EB'
  },
  axis: {
    stroke: '#6B7280'
  }
};

export function ChartVisualizer() {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [data, setData] = useState<DataPoint[]>([
    { name: 'Item 1', value: 30 },
    { name: 'Item 2', value: 45 },
    { name: 'Item 3', value: 25 },
  ]);
  const [chartTitle, setChartTitle] = useState('My Chart');

  const updateDataPoint = (index: number, field: 'name' | 'value', value: string | number) => {
    if (index < 0 || index >= data.length) return;
    const newData = [...data];
    if (field === 'value') {
      const numValue = Number(value);
      newData[index][field] = isNaN(numValue) ? 0 : Math.max(0, numValue);
    } else {
      newData[index][field] = value as string;
    }
    setData(newData);
  };

  const addDataPoint = () => {
    if (data.length >= 15) return; // Limit max data points
    setData([...data, { name: `Item ${data.length + 1}`, value: 0 }]);
  };

  const removeDataPoint = (index: number) => {
    if (data.length > 1) {
      setData(data.filter((_, i) => i !== index));
    }
  };

  const renderChart = useMemo(() => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid {...CHART_STYLE.grid} />
              <XAxis dataKey="name" {...CHART_STYLE.axis} />
              <YAxis {...CHART_STYLE.axis} />
              <Tooltip contentStyle={CHART_STYLE.tooltip} />
              <Bar dataKey="value" fill={COLORS[0]} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid {...CHART_STYLE.grid} />
              <XAxis dataKey="name" {...CHART_STYLE.axis} />
              <YAxis {...CHART_STYLE.axis} />
              <Tooltip contentStyle={CHART_STYLE.tooltip} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={COLORS[0]} 
                strokeWidth={2}
                dot={{ fill: COLORS[0], strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  }, [chartType, data]);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Chart Visualizer</h3>
        <p className="text-xs text-stone-gray dark:text-gray-500">
          Create beautiful charts from your data
        </p>
      </div>

      {/* Chart Title */}
      <div>
        <Label htmlFor="chart-title" className="text-xs">Chart Title</Label>
        <Input
          id="chart-title"
          value={chartTitle}
          onChange={(e) => setChartTitle(e.target.value)}
          className="h-8 text-sm"
        />
      </div>

      {/* Chart Type */}
      <div>
        <Label htmlFor="chart-type" className="text-xs">Chart Type</Label>
        <Select value={chartType} onValueChange={(value) => setChartType(value as ChartType)}>
          <SelectTrigger id="chart-type" className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Bar Chart</SelectItem>
            <SelectItem value="line">Line Chart</SelectItem>
            <SelectItem value="pie">Pie Chart</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Data Points</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addDataPoint}
            className="h-7 text-xs"
            disabled={data.length >= 15}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
        
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {data.map((point, index) => (
            <div key={index} className="flex gap-2 items-center group">
              <Input
                value={point.name}
                onChange={(e) => updateDataPoint(index, 'name', e.target.value)}
                className="h-8 text-sm flex-1"
                placeholder="Label"
              />
              <Input
                type="number"
                value={point.value}
                onChange={(e) => updateDataPoint(index, 'value', e.target.value)}
                className="h-8 text-sm w-20"
                placeholder="Value"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeDataPoint(index)}
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Preview */}
      <div className="border border-mist-gray dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
        <h4 className="text-center font-medium mb-4">{chartTitle}</h4>
        {renderChart}
      </div>
    </div>
  );
}