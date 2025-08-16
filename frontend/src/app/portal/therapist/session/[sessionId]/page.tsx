'use client';

import React from 'react';
import { PortalPageWrapper } from '@/components/layout/PortalPageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';

interface SessionPageProps {
  params: {
    sessionId: string;
  };
}

export default function SessionPage({ params }: SessionPageProps) {
  const { addToast } = useToast();
  const { sessionId } = params;

  // TODO: Implement session logic and data fetching
  React.useEffect(() => {
    if (!sessionId) {
      addToast({
        type: 'error',
        title: 'Parameter Tidak Valid',
        message: 'ID sesi tidak ditemukan',
      });
    }
  }, [sessionId, addToast]);

  return (
    <PortalPageWrapper
      title="Detail Sesi"
      description={`Detail dan manajemen sesi ID: ${sessionId}`}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Informasi Sesi
              <Badge variant="outline">Dijadwalkan</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              ID Sesi: {sessionId}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Halaman detail sesi akan dikembangkan lebih lanjut dengan fitur lengkap manajemen sesi terapi.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Catatan Sesi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Fitur catatan sesi akan segera tersedia.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teknik Terapi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Fitur teknik terapi akan segera tersedia.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hasil Evaluasi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Fitur hasil evaluasi akan segera tersedia.
            </p>
          </CardContent>
        </Card>
      </div>
    </PortalPageWrapper>
  );
}