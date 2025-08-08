'use client';

import { useState, useEffect } from 'react';
import { useUsageMetrics } from '@/hooks/useClients';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUpgradePrompt } from './UpgradePrompt';
import { 
  AlertTriangle,
  AlertCircle,
  XCircle,
  Users,
  FileText,
  UserCheck,
  Crown,
  X,
  Bell,
  Settings
} from 'lucide-react';

interface LimitWarning {
  id: string;
  type: 'clients' | 'scripts' | 'therapists';
  severity: 'warning' | 'critical' | 'blocked';
  title: string;
  message: string;
  current: number;
  limit: number;
  percentage: number;
  icon: React.ComponentType<any>;
  color: string;
}

interface LimitWarningsProps {
  showHeader?: boolean;
  compact?: boolean;
  onUpgradeClick?: () => void;
}

export function LimitWarnings({ showHeader = true, compact = false, onUpgradeClick }: LimitWarningsProps) {
  const { usage, loading } = useUsageMetrics();
  const [dismissedWarnings, setDismissedWarnings] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(true);
  const { showUpgradePrompt, UpgradeModal } = useUpgradePrompt();

  const warnings: LimitWarning[] = [];

  // Calculate usage percentages and generate warnings
  const clientUsagePercent = (usage.today.clientsAdded / usage.today.clientsLimit) * 100;
  const scriptUsagePercent = (usage.today.scriptsGenerated / usage.today.scriptsLimit) * 100;
  const therapistUsagePercent = (usage.today.therapistsActive / usage.today.therapistsLimit) * 100;

  // Client warnings
  if (clientUsagePercent >= 100) {
    warnings.push({
      id: 'clients-blocked',
      type: 'clients',
      severity: 'blocked',
      title: 'Batas Klien Tercapai',
      message: 'Tidak dapat menambahkan klien baru hari ini. Tingkatkan paket langganan untuk melanjutkan.',
      current: usage.today.clientsAdded,
      limit: usage.today.clientsLimit,
      percentage: clientUsagePercent,
      icon: XCircle,
      color: 'red'
    });
  } else if (clientUsagePercent >= 90) {
    warnings.push({
      id: 'clients-critical',
      type: 'clients',
      severity: 'critical',
      title: 'Batas Klien Hampir Tercapai',
      message: `Hanya ${usage.today.clientsLimit - usage.today.clientsAdded} slot klien tersisa untuk hari ini.`,
      current: usage.today.clientsAdded,
      limit: usage.today.clientsLimit,
      percentage: clientUsagePercent,
      icon: AlertCircle,
      color: 'red'
    });
  } else if (clientUsagePercent >= 75) {
    warnings.push({
      id: 'clients-warning',
      type: 'clients',
      severity: 'warning',
      title: 'Penggunaan Klien Tinggi',
      message: `${usage.today.clientsAdded} dari ${usage.today.clientsLimit} klien telah digunakan hari ini.`,
      current: usage.today.clientsAdded,
      limit: usage.today.clientsLimit,
      percentage: clientUsagePercent,
      icon: AlertTriangle,
      color: 'yellow'
    });
  }

  // Script warnings
  if (scriptUsagePercent >= 100) {
    warnings.push({
      id: 'scripts-blocked',
      type: 'scripts',
      severity: 'blocked',
      title: 'Batas Skrip Tercapai',
      message: 'Tidak dapat membuat skrip baru hari ini. Tingkatkan paket langganan untuk melanjutkan.',
      current: usage.today.scriptsGenerated,
      limit: usage.today.scriptsLimit,
      percentage: scriptUsagePercent,
      icon: XCircle,
      color: 'red'
    });
  } else if (scriptUsagePercent >= 90) {
    warnings.push({
      id: 'scripts-critical',
      type: 'scripts',
      severity: 'critical',
      title: 'Batas Skrip Hampir Tercapai',
      message: `Hanya ${usage.today.scriptsLimit - usage.today.scriptsGenerated} skrip tersisa untuk hari ini.`,
      current: usage.today.scriptsGenerated,
      limit: usage.today.scriptsLimit,
      percentage: scriptUsagePercent,
      icon: AlertCircle,
      color: 'red'
    });
  } else if (scriptUsagePercent >= 75) {
    warnings.push({
      id: 'scripts-warning',
      type: 'scripts',
      severity: 'warning',
      title: 'Penggunaan Skrip Tinggi',
      message: `${usage.today.scriptsGenerated} dari ${usage.today.scriptsLimit} skrip telah dibuat hari ini.`,
      current: usage.today.scriptsGenerated,
      limit: usage.today.scriptsLimit,
      percentage: scriptUsagePercent,
      icon: AlertTriangle,
      color: 'yellow'
    });
  }

  // Therapist warnings
  if (therapistUsagePercent >= 100) {
    warnings.push({
      id: 'therapists-blocked',
      type: 'therapists',
      severity: 'blocked',
      title: 'Batas Terapis Tercapai',
      message: 'Tidak dapat menambahkan terapis baru. Tingkatkan paket langganan untuk melanjutkan.',
      current: usage.today.therapistsActive,
      limit: usage.today.therapistsLimit,
      percentage: therapistUsagePercent,
      icon: XCircle,
      color: 'red'
    });
  } else if (therapistUsagePercent >= 90) {
    warnings.push({
      id: 'therapists-critical',
      type: 'therapists',
      severity: 'critical',
      title: 'Batas Terapis Hampir Tercapai',
      message: `Hanya ${usage.today.therapistsLimit - usage.today.therapistsActive} slot terapis tersisa.`,
      current: usage.today.therapistsActive,
      limit: usage.today.therapistsLimit,
      percentage: therapistUsagePercent,
      icon: AlertCircle,
      color: 'red'
    });
  }

  // Filter out dismissed warnings
  const activeWarnings = warnings.filter(warning => 
    !dismissedWarnings.includes(warning.id)
  );

  const dismissWarning = (warningId: string) => {
    setDismissedWarnings(prev => [...prev, warningId]);
  };

  const clearAllWarnings = () => {
    setDismissedWarnings(warnings.map(w => w.id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'clients': return Users;
      case 'scripts': return FileText;
      case 'therapists': return UserCheck;
      default: return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'blocked': return 'destructive';
      case 'critical': return 'destructive';
      case 'warning': return 'warning';
      default: return 'default';
    }
  };

  if (loading || activeWarnings.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="space-y-2">
        {activeWarnings.slice(0, 2).map((warning) => {
          const Icon = warning.icon;
          const TypeIcon = getTypeIcon(warning.type);
          
          return (
            <Alert key={warning.id} className={`border-${warning.color}-200 bg-${warning.color}-50`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 text-${warning.color}-600`} />
                  <div>
                    <div className="font-medium text-sm">{warning.title}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {warning.current}/{warning.limit} ({warning.percentage.toFixed(0)}%)
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissWarning(warning.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </Alert>
          );
        })}
        
        {activeWarnings.length > 2 && (
          <div className="text-xs text-gray-500 text-center">
            +{activeWarnings.length - 2} peringatan lainnya
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Peringatan Batas Penggunaan
            </h3>
            <Badge variant="destructive">
              {activeWarnings.length}
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            
            {activeWarnings.length > 1 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearAllWarnings}
              >
                Tutup Semua
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {activeWarnings.map((warning) => {
          const Icon = warning.icon;
          const TypeIcon = getTypeIcon(warning.type);
          
          return (
            <Card key={warning.id} className={`border-${warning.color}-200 ${warning.severity === 'blocked' ? 'bg-red-50' : warning.severity === 'critical' ? 'bg-red-50' : 'bg-yellow-50'}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-2 rounded-lg ${warning.severity === 'blocked' ? 'bg-red-100' : warning.severity === 'critical' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                      <Icon className={`h-5 w-5 text-${warning.color}-600`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className={`font-semibold text-${warning.color}-800`}>
                          {warning.title}
                        </h4>
                        <Badge variant={getSeverityColor(warning.severity) as any}>
                          <TypeIcon className="h-3 w-3 mr-1" />
                          {warning.percentage.toFixed(0)}%
                        </Badge>
                      </div>
                      
                      <p className={`text-${warning.color}-700 mb-4`}>
                        {warning.message}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className={`text-${warning.color}-700`}>
                            {warning.current} dari {warning.limit}
                          </span>
                          <span className={`font-medium text-${warning.color}-800`}>
                            {warning.percentage.toFixed(1)}%
                          </span>
                        </div>
                        
                        <Progress 
                          value={Math.min(warning.percentage, 100)} 
                          className={`h-2 ${warning.severity === 'blocked' || warning.severity === 'critical' ? '[&>div]:bg-red-500' : '[&>div]:bg-yellow-500'}`}
                        />
                      </div>
                      
                      {(warning.severity === 'blocked' || warning.severity === 'critical') && (
                        <div className="mt-4 flex gap-3">
                          <Button 
                            size="sm" 
                            onClick={() => {
                              if (onUpgradeClick) {
                                onUpgradeClick();
                              } else {
                                showUpgradePrompt(warning.type);
                              }
                            }}
                            className="flex items-center gap-2"
                          >
                            <Crown className="h-4 w-4" />
                            Tingkatkan Paket
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => dismissWarning(warning.id)}
                          >
                            Tutup
                          </Button>
                        </div>
                      )}
                      
                      {warning.severity === 'warning' && (
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => dismissWarning(warning.id)}
                          >
                            Tutup Peringatan
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Card */}
      {activeWarnings.length > 0 && (
        <Card className="bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-gray-600" />
              Ringkasan Penggunaan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Klien</span>
                <span className={`font-medium ${clientUsagePercent >= 90 ? 'text-red-600' : clientUsagePercent >= 75 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {usage.today.clientsAdded}/{usage.today.clientsLimit}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Skrip</span>
                <span className={`font-medium ${scriptUsagePercent >= 90 ? 'text-red-600' : scriptUsagePercent >= 75 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {usage.today.scriptsGenerated}/{usage.today.scriptsLimit}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Terapis</span>
                <span className={`font-medium ${therapistUsagePercent >= 90 ? 'text-red-600' : therapistUsagePercent >= 75 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {usage.today.therapistsActive}/{usage.today.therapistsLimit}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal onUpgrade={(plan) => {
        console.log(`Upgrading to ${plan} plan`);
        // Handle upgrade logic here
      }} />
    </div>
  );
}