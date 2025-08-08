'use client';

import { useUsageMetrics } from '@/hooks/useClients';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Users,
  FileText,
  Calendar,
  Clock
} from 'lucide-react';

interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
}

interface TrendData {
  day: string;
  clients: number;
  scripts: number;
}

export function UsageAnalytics() {
  const { usage, loading } = useUsageMetrics();

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-5 bg-gray-200 rounded w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Prepare trend data for the last 11 days
  const trendData: TrendData[] = usage.trends.clientGrowth.map((clients, index) => ({
    day: `${index + 1}`,
    clients,
    scripts: usage.trends.scriptUsage[index] || 0
  }));

  // Calculate growth metrics
  const getGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const clientGrowthRate = usage.trends.clientGrowth.length > 1 
    ? getGrowthRate(
        usage.trends.clientGrowth[usage.trends.clientGrowth.length - 1],
        usage.trends.clientGrowth[usage.trends.clientGrowth.length - 2]
      )
    : 0;

  const scriptGrowthRate = usage.trends.scriptUsage.length > 1 
    ? getGrowthRate(
        usage.trends.scriptUsage[usage.trends.scriptUsage.length - 1],
        usage.trends.scriptUsage[usage.trends.scriptUsage.length - 2]
      )
    : 0;

  // Usage distribution data
  const usageDistribution: ChartDataPoint[] = [
    {
      label: 'Klien Hari Ini',
      value: usage.today.clientsAdded,
      color: 'bg-blue-500'
    },
    {
      label: 'Skrip Hari Ini',
      value: usage.today.scriptsGenerated,
      color: 'bg-green-500'
    },
    {
      label: 'Terapis Aktif',
      value: usage.today.therapistsActive,
      color: 'bg-purple-500'
    }
  ];

  const totalUsage = usageDistribution.reduce((sum, item) => sum + item.value, 0);

  // Monthly comparison data
  const monthlyData = [
    {
      metric: 'Klien',
      current: usage.thisMonth.clientsAdded,
      target: usage.today.clientsLimit * 30, // Rough monthly target
      icon: Users,
      color: 'blue'
    },
    {
      metric: 'Skrip',
      current: usage.thisMonth.scriptsGenerated,
      target: usage.today.scriptsLimit * 30,
      icon: FileText,
      color: 'green'
    },
    {
      metric: 'Sesi',
      current: usage.thisMonth.sessionsCompleted,
      target: usage.thisMonth.clientsAdded * 3, // Rough target of 3 sessions per client
      icon: Clock,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Growth Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pertumbuhan Klien</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold">
                    {Math.abs(clientGrowthRate).toFixed(1)}%
                  </span>
                  {clientGrowthRate > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
              <div className={`p-3 rounded-lg ${clientGrowthRate > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <Users className={`h-5 w-5 ${clientGrowthRate > 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pertumbuhan Skrip</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold">
                    {Math.abs(scriptGrowthRate).toFixed(1)}%
                  </span>
                  {scriptGrowthRate > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
              <div className={`p-3 rounded-lg ${scriptGrowthRate > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <FileText className={`h-5 w-5 ${scriptGrowthRate > 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rating Rata-rata</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold">
                    {usage.thisMonth.averageRating.toFixed(1)}
                  </span>
                  <Badge variant="success">Sangat Baik</Badge>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Aktivitas</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold">{totalUsage}</span>
                  <Badge variant="default">Hari Ini</Badge>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Growth Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-blue-600" />
              Tren Pertumbuhan Klien (11 Hari)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end justify-between h-48 gap-2">
                {trendData.map((data, index) => {
                  const maxValue = Math.max(...trendData.map(d => d.clients));
                  const height = maxValue > 0 ? (data.clients / maxValue) * 180 : 4;
                  
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="relative group">
                        <div 
                          className="w-full bg-blue-400 rounded-t hover:bg-blue-500 transition-colors cursor-pointer"
                          style={{ 
                            height: `${height}px`,
                            minHeight: '8px'
                          }}
                        />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {data.clients} klien
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">{data.day}</div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Hari ke-1</span>
                <span>Hari ke-11</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Script Usage Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Tren Penggunaan Skrip (11 Hari)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end justify-between h-48 gap-2">
                {trendData.map((data, index) => {
                  const maxValue = Math.max(...trendData.map(d => d.scripts));
                  const height = maxValue > 0 ? (data.scripts / maxValue) * 180 : 4;
                  
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="relative group">
                        <div 
                          className="w-full bg-green-400 rounded-t hover:bg-green-500 transition-colors cursor-pointer"
                          style={{ 
                            height: `${height}px`,
                            minHeight: '8px'
                          }}
                        />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {data.scripts} skrip
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">{data.day}</div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Hari ke-1</span>
                <span>Hari ke-11</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-purple-600" />
            Distribusi Penggunaan Hari Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Simple Pie Chart Visualization */}
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                {usageDistribution.map((item, index) => {
                  const percentage = totalUsage > 0 ? (item.value / totalUsage) * 100 : 0;
                  const strokeDasharray = `${percentage * 2.51}, 251`;
                  const rotation = index === 0 ? 0 : 
                    usageDistribution.slice(0, index).reduce((sum, prev) => 
                      sum + (totalUsage > 0 ? (prev.value / totalUsage) * 360 : 0), 0
                    );
                  
                  return (
                    <svg
                      key={index}
                      className="absolute inset-0 w-full h-full transform -rotate-90"
                      style={{ transform: `rotate(${rotation - 90}deg)` }}
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={item.color.replace('bg-', '').replace('-500', '')}
                        strokeWidth="8"
                        strokeDasharray={strokeDasharray}
                        strokeLinecap="round"
                        className="opacity-80"
                      />
                    </svg>
                  );
                })}
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold text-gray-900">{totalUsage}</span>
                  <span className="text-sm text-gray-600">Total</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-4">
              {usageDistribution.map((item, index) => {
                const percentage = totalUsage > 0 ? (item.value / totalUsage) * 100 : 0;
                
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${item.color}`} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{item.value}</span>
                      <span className="text-sm text-gray-500">
                        ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Performa Bulanan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {monthlyData.map((item, index) => {
              const Icon = item.icon;
              const percentage = item.target > 0 ? (item.current / item.target) * 100 : 0;
              const isOnTarget = percentage >= 80;
              
              return (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-${item.color}-100`}>
                        <Icon className={`h-5 w-5 text-${item.color}-600`} />
                      </div>
                      <div>
                        <p className="font-medium">{item.metric}</p>
                        <p className="text-sm text-gray-600">
                          {item.current} dari target {item.target}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{percentage.toFixed(0)}%</p>
                      <Badge variant={isOnTarget ? 'success' : percentage >= 60 ? 'warning' : 'destructive'}>
                        {isOnTarget ? 'Target Tercapai' : percentage >= 60 ? 'Hampir Target' : 'Perlu Peningkatan'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${isOnTarget ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}