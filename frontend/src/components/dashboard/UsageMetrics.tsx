'use client';

import { useState, useEffect } from 'react';
import { useUsageMetrics } from '@/hooks/useClients';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LimitWarnings } from './LimitWarnings';
import { UsageAnalytics } from './UsageAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Calendar,
  Crown,
  PieChart,
  Activity
} from 'lucide-react';

export function UsageMetrics() {
  const { usage, loading, refreshUsage } = useUsageMetrics();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshUsage();
    setRefreshing(false);
  };

  const handleUpgradeClick = () => {
    // This would typically open an upgrade modal or redirect to billing
    console.log('Upgrade clicked - would redirect to billing/upgrade page');
  };

  // Calculate usage percentages
  const clientUsagePercent = (usage.today.clientsAdded / usage.today.clientsLimit) * 100;
  const scriptUsagePercent = (usage.today.scriptsGenerated / usage.today.scriptsLimit) * 100;
  const therapistUsagePercent = (usage.today.therapistsActive / usage.today.therapistsLimit) * 100;

  // Get usage status colors
  const getUsageColor = (percent: number) => {
    if (percent >= 90) return 'text-red-600';
    if (percent >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getUsageVariant = (percent: number) => {
    if (percent >= 90) return 'destructive' as const;
    if (percent >= 75) return 'warning' as const;
    return 'default' as const;
  };

  // Calculate growth rates
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

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-5 bg-gray-200 rounded w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Metrik Penggunaan</h2>
          <p className="text-gray-600">Pantau penggunaan harian dan batasan langganan</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <BarChart3 className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Memperbarui...' : 'Perbarui'}
        </Button>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Ringkasan
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Analitik
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Tren
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">

      {/* Daily Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Clients Added Today */}
        <Card className={clientUsagePercent >= 90 ? 'border-red-200 bg-red-50' : clientUsagePercent >= 75 ? 'border-yellow-200 bg-yellow-50' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <Users className={`h-5 w-5 ${getUsageColor(clientUsagePercent)}`} />
                Klien Hari Ini
              </div>
              <Badge variant={getUsageVariant(clientUsagePercent)}>
                {clientUsagePercent.toFixed(0)}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {usage.today.clientsAdded}
              </span>
              <span className="text-sm text-gray-500">
                dari {usage.today.clientsLimit}
              </span>
            </div>
            
            <Progress 
              value={clientUsagePercent} 
              className={`h-2 ${clientUsagePercent >= 90 ? '[&>div]:bg-red-500' : clientUsagePercent >= 75 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}`}
            />
            
            <div className="flex items-center gap-1 text-sm">
              {clientGrowthRate > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={clientGrowthRate > 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(clientGrowthRate).toFixed(1)}%
              </span>
              <span className="text-gray-500">dari kemarin</span>
            </div>
          </CardContent>
        </Card>

        {/* Scripts Generated Today */}
        <Card className={scriptUsagePercent >= 90 ? 'border-red-200 bg-red-50' : scriptUsagePercent >= 75 ? 'border-yellow-200 bg-yellow-50' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <FileText className={`h-5 w-5 ${getUsageColor(scriptUsagePercent)}`} />
                Skrip Hari Ini
              </div>
              <Badge variant={getUsageVariant(scriptUsagePercent)}>
                {scriptUsagePercent.toFixed(0)}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {usage.today.scriptsGenerated}
              </span>
              <span className="text-sm text-gray-500">
                dari {usage.today.scriptsLimit}
              </span>
            </div>
            
            <Progress 
              value={scriptUsagePercent} 
              className={`h-2 ${scriptUsagePercent >= 90 ? '[&>div]:bg-red-500' : scriptUsagePercent >= 75 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}`}
            />
            
            <div className="flex items-center gap-1 text-sm">
              {scriptGrowthRate > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={scriptGrowthRate > 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(scriptGrowthRate).toFixed(1)}%
              </span>
              <span className="text-gray-500">dari kemarin</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Therapists */}
        <Card className={therapistUsagePercent >= 90 ? 'border-red-200 bg-red-50' : therapistUsagePercent >= 75 ? 'border-yellow-200 bg-yellow-50' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <UserCheck className={`h-5 w-5 ${getUsageColor(therapistUsagePercent)}`} />
                Terapis Aktif
              </div>
              <Badge variant={getUsageVariant(therapistUsagePercent)}>
                {therapistUsagePercent.toFixed(0)}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {usage.today.therapistsActive}
              </span>
              <span className="text-sm text-gray-500">
                dari {usage.today.therapistsLimit}
              </span>
            </div>
            
            <Progress 
              value={therapistUsagePercent} 
              className={`h-2 ${therapistUsagePercent >= 90 ? '[&>div]:bg-red-500' : therapistUsagePercent >= 75 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}`}
            />
            
            <div className="flex items-center gap-1 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-green-600">Dalam batas normal</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Limit Warnings */}
      <LimitWarnings onUpgradeClick={handleUpgradeClick} />

      {/* Monthly Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-blue-500" />
              Bulan Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                {usage.thisMonth.clientsAdded}
              </div>
              <div className="text-sm text-gray-600">Klien Ditambahkan</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-green-500" />
              Bulan Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">
                {usage.thisMonth.scriptsGenerated}
              </div>
              <div className="text-sm text-gray-600">Skrip Dibuat</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-purple-500" />
              Bulan Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-600">
                {usage.thisMonth.sessionsCompleted}
              </div>
              <div className="text-sm text-gray-600">Sesi Diselesaikan</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Crown className="h-4 w-4 text-yellow-500" />
              Rating Rata-rata
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-yellow-600">
                {usage.thisMonth.averageRating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">dari 5.0</div>
            </div>
          </CardContent>
        </Card>
      </div>

        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 mt-6">
          <UsageAnalytics />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6 mt-6">
          {/* Usage Trends - Simple visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Tren Penggunaan (11 Hari Terakhir)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Growth Trend */}
                <div>
                  <h4 className="font-medium mb-3 text-sm">Pertumbuhan Klien</h4>
                  <div className="flex items-end justify-between h-20 gap-1">
                    {usage.trends.clientGrowth.map((value, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-blue-200 rounded-t"
                          style={{ 
                            height: `${(value / Math.max(...usage.trends.clientGrowth)) * 60}px`,
                            minHeight: '4px'
                          }}
                        />
                        <div className="text-xs text-gray-500 mt-1">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Script Usage Trend */}
                <div>
                  <h4 className="font-medium mb-3 text-sm">Penggunaan Skrip</h4>
                  <div className="flex items-end justify-between h-20 gap-1">
                    {usage.trends.scriptUsage.map((value, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-green-200 rounded-t"
                          style={{ 
                            height: `${(value / Math.max(...usage.trends.scriptUsage)) * 60}px`,
                            minHeight: '4px'
                          }}
                        />
                        <div className="text-xs text-gray-500 mt-1">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}