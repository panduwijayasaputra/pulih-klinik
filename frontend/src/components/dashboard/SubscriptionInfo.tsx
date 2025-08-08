'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSubscription } from '@/hooks/useSubscription';
import { formatCurrency } from '@/lib/constants';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChartBarIcon,
  CreditCardIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface SubscriptionInfoProps {
  className?: string;
  showUpgradeButton?: boolean;
  compact?: boolean;
}

export const SubscriptionInfo: React.FC<SubscriptionInfoProps> = ({
  className = "",
  showUpgradeButton = true,
  compact = false
}) => {
  const {
    subscription,
    currentTierInfo,
    usageMetrics,
    usageAlerts,
    upgradeOptions,
    downgradeOptions
  } = useSubscription();

  const [, setShowUpgradeModal] = useState(false);

  console.log('SubscriptionInfo render:', { subscription, currentTierInfo, usageMetrics });

  if (!subscription || !currentTierInfo || !usageMetrics) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 bg-gray-300 rounded flex-1 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get status color and badge variant
  const getStatusInfo = () => {
    switch (subscription.status) {
      case 'active':
        return { variant: 'default' as const, text: 'Aktif', color: 'text-green-600' };
      case 'inactive':
        return { variant: 'secondary' as const, text: 'Tidak Aktif', color: 'text-gray-600' };
      case 'suspended':
        return { variant: 'destructive' as const, text: 'Ditangguhkan', color: 'text-red-600' };
      case 'cancelled':
        return { variant: 'outline' as const, text: 'Dibatalkan', color: 'text-red-600' };
      default:
        return { variant: 'secondary' as const, text: 'Unknown', color: 'text-gray-600' };
    }
  };

  const statusInfo = getStatusInfo();
  const hasAlerts = usageAlerts.length > 0;
  const criticalAlerts = usageAlerts.filter(alert => alert.type === 'critical' || alert.type === 'limit_reached');

  if (compact) {
    return (
      <Card className={`${className} ${currentTierInfo.borderColor} border-2`}>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Badge variant={statusInfo.variant} className={`${currentTierInfo.color} ${currentTierInfo.bgColor}`}>
                {currentTierInfo.name}
              </Badge>
              <div>
                <p className="font-medium text-sm">{formatCurrency(subscription.billing.amount)}/bulan</p>
                <p className="text-xs text-muted-foreground">Status: {statusInfo.text}</p>
              </div>
            </div>
            {showUpgradeButton && upgradeOptions.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => setShowUpgradeModal(true)}>
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                Upgrade
              </Button>
            )}
          </div>
          
          {hasAlerts && (
            <div className="mt-3 flex items-center text-sm text-amber-600">
              <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
              <span>{criticalAlerts.length > 0 ? 'Batas usage tercapai' : 'Mendekati batas usage'}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} ${currentTierInfo.borderColor} border-2 ${currentTierInfo.bgColor}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CreditCardIcon className={`h-6 w-6 ${currentTierInfo.color}`} />
            <div>
              <CardTitle className="text-lg">Paket {currentTierInfo.name}</CardTitle>
              <CardDescription>
                {formatCurrency(subscription.billing.amount)} per bulan
              </CardDescription>
            </div>
          </div>
          <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Usage Alerts */}
        {hasAlerts && (
          <div className="space-y-2">
            {usageAlerts.map((alert, index) => (
              <div 
                key={index}
                className={`flex items-center p-3 rounded-lg border ${
                  alert.type === 'limit_reached' 
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : alert.type === 'critical'
                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                    : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}
              >
                <ExclamationTriangleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="text-sm font-medium">{alert.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* Usage Metrics */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <ChartBarIcon className="h-5 w-5 text-muted-foreground" />
            <h4 className="font-medium">Penggunaan Saat Ini</h4>
          </div>

          {/* Therapists */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Therapist</span>
              <span className="text-sm text-muted-foreground">
                {usageMetrics.therapists.current}/{usageMetrics.therapists.limit}
              </span>
            </div>
            <Progress 
              value={usageMetrics.therapists.percentage} 
              className="h-2"
            />
          </div>

          {/* Clients Today */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Klien Hari Ini</span>
              <span className="text-sm text-muted-foreground">
                {usageMetrics.clientsToday.current}/{usageMetrics.clientsToday.limit}
              </span>
            </div>
            <Progress 
              value={usageMetrics.clientsToday.percentage} 
              className="h-2"
            />
          </div>

          {/* Scripts Today */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Script Hari Ini</span>
              <span className="text-sm text-muted-foreground">
                {usageMetrics.scriptsToday.current}/{usageMetrics.scriptsToday.limit}
              </span>
            </div>
            <Progress 
              value={usageMetrics.scriptsToday.percentage} 
              className="h-2"
            />
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{usageMetrics.clientsThisMonth.current}</p>
            <p className="text-xs text-muted-foreground">Klien bulan ini</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{usageMetrics.scriptsThisMonth.current}</p>
            <p className="text-xs text-muted-foreground">Script bulan ini</p>
          </div>
        </div>

        {/* Billing Info */}
        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Tagihan Berikutnya</span>
            <span className="text-sm font-medium">
              {new Date(subscription.billing.nextBilling).toLocaleDateString('id-ID')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Jumlah</span>
            <span className="text-sm font-medium">
              {formatCurrency(subscription.billing.amount)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        {showUpgradeButton && (
          <div className="flex space-x-2 pt-4 border-t">
            {upgradeOptions.length > 0 && (
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1"
                onClick={() => setShowUpgradeModal(true)}
              >
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                Upgrade
              </Button>
            )}
            {downgradeOptions.length > 0 && (
              <Button variant="outline" size="sm" className="flex-1">
                <ArrowDownIcon className="h-4 w-4 mr-1" />
                Downgrade
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};