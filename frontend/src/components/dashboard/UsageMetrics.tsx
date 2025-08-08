'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { 
  ChartBarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  UserGroupIcon, 
  UsersIcon
} from '@heroicons/react/24/outline';

interface UsageMetricsProps {
  className?: string;
  showAlerts?: boolean;
  compact?: boolean;
}

export const UsageMetrics: React.FC<UsageMetricsProps> = ({
  className = "",
  showAlerts = true,
  compact = false
}) => {
  const { usageMetrics, usageAlerts, currentTierInfo } = useSubscription();

  if (!usageMetrics || !currentTierInfo) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-2 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // const getProgressColor = (percentage: number) => {
  //   if (percentage >= 95) return 'bg-red-500';
  //   if (percentage >= 80) return 'bg-amber-500';
  //   return 'bg-blue-500';
  // };

  const getUsageStatus = (percentage: number) => {
    if (percentage >= 100) return { text: 'Limit Tercapai', variant: 'destructive' as const };
    if (percentage >= 95) return { text: 'Hampir Penuh', variant: 'destructive' as const };
    if (percentage >= 80) return { text: 'Tinggi', variant: 'secondary' as const };
    return { text: 'Normal', variant: 'default' as const };
  };

  const metrics = [
    {
      key: 'therapists',
      icon: UserGroupIcon,
      label: 'Therapist',
      current: usageMetrics.therapists.current,
      limit: usageMetrics.therapists.limit,
      percentage: usageMetrics.therapists.percentage,
      color: currentTierInfo.color,
      description: 'Jumlah therapist aktif'
    },
    {
      key: 'clientsToday',
      icon: UsersIcon,
      label: 'Klien Hari Ini',
      current: usageMetrics.clientsToday.current,
      limit: usageMetrics.clientsToday.limit,
      percentage: usageMetrics.clientsToday.percentage,
      color: 'text-green-600',
      description: 'Klien baru yang ditambahkan hari ini'
    },
    {
      key: 'scriptsToday',
      icon: DocumentTextIcon,
      label: 'Script Hari Ini',
      current: usageMetrics.scriptsToday.current,
      limit: usageMetrics.scriptsToday.limit,
      percentage: usageMetrics.scriptsToday.percentage,
      color: 'text-purple-600',
      description: 'Script yang dibuat hari ini'
    }
  ];

  if (compact) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Usage Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {metrics.map((metric) => {
            const status = getUsageStatus(metric.percentage);
            return (
              <div key={metric.key} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <metric.icon className={`h-4 w-4 ${metric.color} flex-shrink-0`} />
                  <span className="text-sm font-medium truncate">{metric.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {metric.current}/{metric.limit}
                  </span>
                  <Badge variant={status.variant} className="text-xs">
                    {metric.percentage}%
                  </Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ChartBarIcon className="h-6 w-6 mr-2" />
          Usage Metrics
        </CardTitle>
        <CardDescription>
          Pantau penggunaan resources sesuai paket {currentTierInfo.name}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Usage Alerts */}
        {showAlerts && usageAlerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Peringatan</h4>
            {usageAlerts.slice(0, 3).map((alert, index) => (
              <div 
                key={index}
                className={`flex items-start p-3 rounded-lg border text-sm ${
                  alert.type === 'limit_reached' 
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : alert.type === 'critical'
                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                    : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}
              >
                <ExclamationTriangleIcon className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{alert.message}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {new Date(alert.timestamp).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detailed Metrics */}
        <div className="space-y-6">
          {metrics.map((metric) => {
            const status = getUsageStatus(metric.percentage);
            return (
              <div key={metric.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                    <div>
                      <h4 className="font-medium">{metric.label}</h4>
                      <p className="text-xs text-muted-foreground">{metric.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono">
                        {metric.current}/{metric.limit}
                      </span>
                      <Badge variant={status.variant}>
                        {status.text}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {metric.percentage}% tergunakan
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Progress 
                    value={metric.percentage} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span className="font-medium">
                      Sisa: {metric.limit - metric.current}
                    </span>
                    <span>{metric.limit}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Monthly Summary */}
        <div className="pt-6 border-t">
          <h4 className="font-medium mb-3">Ringkasan Bulanan</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-foreground">
                {usageMetrics.clientsThisMonth.current}
              </p>
              <p className="text-xs text-muted-foreground">Total klien bulan ini</p>
              <p className="text-xs text-green-600 mt-1">
                Est. {usageMetrics.clientsThisMonth.estimated} per bulan
              </p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-foreground">
                {usageMetrics.scriptsThisMonth.current}
              </p>
              <p className="text-xs text-muted-foreground">Total script bulan ini</p>
              <p className="text-xs text-green-600 mt-1">
                Est. {usageMetrics.scriptsThisMonth.estimated} per bulan
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};