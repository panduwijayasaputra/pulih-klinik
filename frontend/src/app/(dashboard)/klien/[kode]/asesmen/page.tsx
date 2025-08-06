import type { Metadata } from 'next';
import { MainHeader } from '@/components/layout';

interface KlienAsesmenPageProps {
  params: {
    kode: string;
  };
}

export function generateMetadata({ params }: KlienAsesmenPageProps): Metadata {
  return {
    title: `Asesmen Klien ${params.kode.toUpperCase()} - Smart Therapy`,
    description: `Riwayat asesmen dan hasil analisis AI untuk klien ${params.kode.toUpperCase()}`,
  };
}

export default function KlienAsesmenPage({ params }: KlienAsesmenPageProps) {
  return (
    <div className="space-content">
      <MainHeader
        title={`Asesmen Klien ${params.kode.toUpperCase()}`}
        description="Riwayat asesmen dan analisis AI"
      />

      <div className="responsive-card-grid">
        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Asesmen Terbaru
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Hasil asesmen AI terkini untuk klien ini
          </p>
          <div className="space-form">
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
              <div>
                <p className="font-medium">Asesmen Umum</p>
                <p className="text-sm text-muted-foreground">15 Januari 2024</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-primary">Skor: 85/100</p>
                <p className="text-xs text-muted-foreground">Kompatibilitas Tinggi</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Rekomendasi Teknik
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Teknik hipnoterapi yang direkomendasikan AI
          </p>
          <div className="space-form">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Progressive Relaxation</span>
                <span className="text-sm font-medium text-primary">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Guided Imagery</span>
                <span className="text-sm font-medium text-primary">87%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Cognitive Restructuring</span>
                <span className="text-sm font-medium text-secondary">78%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Profil Asesmen
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Ringkasan hasil analisis profil klien
          </p>
          <div className="space-form">
            <div className="text-sm space-y-2">
              <div><strong>Tujuan Utama:</strong> Mengatasi kecemasan</div>
              <div><strong>Tingkat Receptivitas:</strong> Tinggi (8/10)</div>
              <div><strong>Preferensi Budaya:</strong> Tradisional Indonesia</div>
              <div><strong>Faktor Agama:</strong> Islam - Konservatif</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 glass rounded-lg padding-responsive">
        <h3 className="text-responsive-lg font-semibold mb-4">
          Riwayat Asesmen
        </h3>
        <div className="space-form">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">Asesmen Umum</h4>
                  <p className="text-sm text-muted-foreground">15 Januari 2024, 14:30</p>
                </div>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                  Aktif
                </span>
              </div>
              <p className="text-sm mb-2">
                Evaluasi komprehensif untuk terapi kecemasan dengan pendekatan budaya Indonesia.
              </p>
              <div className="text-xs text-muted-foreground">
                Durasi: 45 menit • Skor Kompatibilitas: 85/100
              </div>
            </div>

            <div className="border rounded-lg p-4 opacity-60">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">Asesmen Awal</h4>
                  <p className="text-sm text-muted-foreground">10 Januari 2024, 10:15</p>
                </div>
                <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                  Selesai
                </span>
              </div>
              <p className="text-sm mb-2">
                Asesmen pendahuluan untuk memahami latar belakang dan kebutuhan klien.
              </p>
              <div className="text-xs text-muted-foreground">
                Durasi: 30 menit • Skor Kompatibilitas: 72/100
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}