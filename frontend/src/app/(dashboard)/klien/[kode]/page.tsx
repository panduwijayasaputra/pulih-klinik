import type { Metadata } from 'next';
import { MainHeader } from '@/components/layout';

interface KlienDetailPageProps {
  params: {
    kode: string;
  };
}

export function generateMetadata({ params }: KlienDetailPageProps): Metadata {
  return {
    title: `Detail Klien ${params.kode.toUpperCase()} - Smart Therapy`,
    description: `Profil dan riwayat klien dengan kode ${params.kode.toUpperCase()}`,
  };
}

export default function KlienDetailPage({ params }: KlienDetailPageProps) {
  return (
    <div className="space-content">
      <MainHeader
        title={`Detail Klien ${params.kode.toUpperCase()}`}
        description="Profil lengkap dan riwayat sesi klien"
      />

      <div className="responsive-form-grid gap-responsive">
        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Profil Klien
          </h3>
          <p className="text-responsive-sm text-muted-foreground">
            Kode Klien: <span className="font-mono font-semibold">{params.kode.toUpperCase()}</span>
          </p>
          <p className="text-responsive-xs text-muted-foreground mt-2">
            Detail profil akan diimplementasikan di task selanjutnya
          </p>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Riwayat Asesmen
          </h3>
          <p className="text-responsive-sm text-muted-foreground">
            Riwayat asesmen dan rekomendasi AI
          </p>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Sesi Hipnoterapi
          </h3>
          <p className="text-responsive-sm text-muted-foreground">
            Riwayat sesi dan progress klien
          </p>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Skrip Generated
          </h3>
          <p className="text-responsive-sm text-muted-foreground">
            Skrip hipnoterapi yang telah dibuat
          </p>
        </div>
      </div>
    </div>
  );
}