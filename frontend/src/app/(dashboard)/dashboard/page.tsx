import type { Metadata } from 'next';
import { MainHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Dashboard - Smart Therapy',
  description: 'Dashboard utama sistem AI Hipnoterapi Indonesia',
};

export default function DashboardPage() {
  return (
    <div className="space-content">
      <MainHeader
        title="Dashboard"
        description="Selamat datang di sistem AI Hipnoterapi Indonesia"
      />

      <div className="responsive-card-grid">
        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-2">
            Klien Aktif
          </h3>
          <p className="text-responsive-sm text-muted-foreground">
            Kelola profil dan riwayat klien Anda
          </p>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-2">
            Asesmen AI
          </h3>
          <p className="text-responsive-sm text-muted-foreground">
            Analisis dan rekomendasi teknik hipnoterapi
          </p>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-2">
            Skrip Sesi
          </h3>
          <p className="text-responsive-sm text-muted-foreground">
            Generate skrip hipnoterapi 7 fase
          </p>
        </div>
      </div>
    </div>
  );
}