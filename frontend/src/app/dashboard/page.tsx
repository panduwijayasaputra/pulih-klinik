'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';

export default function DashboardPage() {
  const { user, isMultiRole } = useAuth();
  const { 
    activeRole, 
    availableRoles, 
    getRoleDisplayInfo,
    switchToRole,
    clearActiveRole 
  } = useNavigation();

  if (!user) {
    return null; // RouteGuard will handle this
  }

  const primaryRole = user.roles[0];
  const primaryRoleInfo = primaryRole ? getRoleDisplayInfo(primaryRole) : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Selamat datang, {user.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              {activeRole ? 
                `Saat ini Anda bekerja sebagai ${getRoleDisplayInfo(activeRole).label}` :
                `Anda memiliki akses sebagai ${primaryRoleInfo?.label || 'Pengguna'}`
              }
            </p>
          </div>
          
          {/* Role Badge */}
          {primaryRoleInfo && (
            <div className="flex items-center space-x-2">
              <Badge 
                variant="outline" 
                className={`${primaryRoleInfo.color} ${primaryRoleInfo.bgColor} border-current`}
              >
                <primaryRoleInfo.icon className="h-4 w-4 mr-1" />
                {activeRole ? getRoleDisplayInfo(activeRole).label : primaryRoleInfo.label}
              </Badge>
            </div>
          )}
        </div>

        {/* Multi-Role Dashboard */}
        {isMultiRole() && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Multi-Role Access
              </CardTitle>
              <CardDescription>
                Anda memiliki akses ke beberapa role. Pilih role untuk menyaring navigasi.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!activeRole ? "default" : "outline"}
                  size="sm"
                  onClick={() => clearActiveRole()}
                >
                  Tampilkan Semua
                </Button>
                {availableRoles.map((role) => {
                  const roleInfo = getRoleDisplayInfo(role);
                  return (
                    <Button
                      key={role}
                      variant={activeRole === role ? "default" : "outline"}
                      size="sm"
                      onClick={() => switchToRole(role)}
                      className="flex items-center space-x-1"
                    >
                      <roleInfo.icon className="h-4 w-4" />
                      <span>{roleInfo.label}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Pengguna</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role(s):</span>
                  <span className="font-medium">{user.roles.join(', ')}</span>
                </div>
                {user.clinicId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Clinic ID:</span>
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                      {user.clinicId}
                    </span>
                  </div>
                )}
                {user.subscriptionTier && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subscription:</span>
                    <Badge variant="secondary">{user.subscriptionTier}</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Role Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Role</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {user.roles.length > 1 
                    ? `Anda memiliki ${user.roles.length} role aktif`
                    : 'Anda memiliki 1 role'
                  }
                </p>
                
                <div className="space-y-2">
                  {user.roles.map((role) => {
                    const roleInfo = getRoleDisplayInfo(role);
                    return (
                      <div key={role} className="flex items-center space-x-2">
                        <roleInfo.icon className={`h-4 w-4 ${roleInfo.color}`} />
                        <span className="text-sm font-medium">{roleInfo.label}</span>
                        {role === activeRole && (
                          <Badge variant="default" className="text-xs">Aktif</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Akses Cepat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {primaryRole === 'administrator' && (
                  <>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Kelola Klinik
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Lihat Analytics
                    </Button>
                  </>
                )}
                
                {primaryRole === 'clinic_admin' && (
                  <>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Kelola Therapist
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Lihat Data Klien
                    </Button>
                  </>
                )}
                
                {primaryRole === 'therapist' && (
                  <>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Klien Hari Ini
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Sesi Terjadwal
                    </Button>
                  </>
                )}
                
                <p className="text-xs text-muted-foreground mt-3">
                  Fitur lengkap sedang dalam pengembangan...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}