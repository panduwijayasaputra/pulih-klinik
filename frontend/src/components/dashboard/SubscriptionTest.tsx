'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useClinicStore } from '@/store/clinic';
import { mockSubscriptionData } from '@/lib/mock-data';

export const SubscriptionTest: React.FC = () => {
  const { subscription, setSubscription, usageMetrics, usageAlerts } = useClinicStore();

  const handleInitialize = () => {
    console.log('Manual initialize clicked');
    setSubscription(mockSubscriptionData);
  };

  const handleReset = () => {
    console.log('Reset clicked');
    useClinicStore.getState().reset();
  };

  useEffect(() => {
    console.log('SubscriptionTest useEffect - subscription:', subscription);
  }, [subscription]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Store Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p><strong>Subscription:</strong> {subscription ? 'Loaded' : 'Not loaded'}</p>
          <p><strong>Usage Metrics:</strong> {usageMetrics ? 'Loaded' : 'Not loaded'}</p>
          <p><strong>Alerts:</strong> {usageAlerts.length} alerts</p>
        </div>
        
        <div className="space-x-2">
          <Button onClick={handleInitialize}>Initialize Mock Data</Button>
          <Button variant="outline" onClick={handleReset}>Reset Store</Button>
        </div>

        {subscription && (
          <div className="p-4 bg-gray-100 rounded">
            <p><strong>Tier:</strong> {subscription.tier}</p>
            <p><strong>Status:</strong> {subscription.status}</p>
            <p><strong>Therapists:</strong> {subscription.usage.therapists}/{subscription.limits.therapists}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};