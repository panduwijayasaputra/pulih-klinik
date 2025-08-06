import type { Metadata } from 'next';
import { MainHeader } from '@/components/layout';

interface KlienSkripPageProps {
  params: {
    kode: string;
  };
}

export function generateMetadata({ params }: KlienSkripPageProps): Metadata {
  return {
    title: `Skrip Klien ${params.kode.toUpperCase()} - Smart Therapy`,
    description: `Koleksi skrip hipnoterapi yang dibuat untuk klien ${params.kode.toUpperCase()}`,
  };
}

export default function KlienSkripPage({ params }: KlienSkripPageProps) {
  return (
    <div className="space-content">
      <MainHeader
        title={`Skrip Klien ${params.kode.toUpperCase()}`}
        description="Koleksi skrip hipnoterapi yang dibuat khusus"
      />

      <div className="responsive-card-grid">
        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Skrip Aktif
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Skrip yang sedang digunakan dalam terapi
          </p>
          <div className="space-form">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-primary">Progressive Relaxation Script</h4>
                  <p className="text-sm text-muted-foreground">Dibuat: 15 Januari 2024</p>
                </div>
                <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                  Aktif
                </span>
              </div>
              <p className="text-sm mb-2">
                Skrip 7 fase yang disesuaikan dengan profil budaya Indonesia dan preferensi religius klien.
              </p>
              <div className="text-xs text-muted-foreground">
                Durasi: 45 menit • Tingkat: Intermediate • AI Score: 92%
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Statistik Skrip
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Data performa skrip yang telah digunakan
          </p>
          <div className="space-form">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">4</div>
                <div className="text-xs text-muted-foreground">Total Skrip</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">87%</div>
                <div className="text-xs text-muted-foreground">Efektivitas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">3</div>
                <div className="text-xs text-muted-foreground">Telah Digunakan</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">8.5</div>
                <div className="text-xs text-muted-foreground">Rata-rata Rating</div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Adaptasi Budaya
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Elemen budaya Indonesia dalam skrip
          </p>
          <div className="space-form">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Bahasa:</span>
                <span className="font-medium">Indonesia Formal</span>
              </div>
              <div className="flex justify-between">
                <span>Konteks Religius:</span>
                <span className="font-medium">Islam - Konservatif</span>
              </div>
              <div className="flex justify-between">
                <span>Imagery:</span>
                <span className="font-medium">Alam Indonesia</span>
              </div>
              <div className="flex justify-between">
                <span>Nilai Budaya:</span>
                <span className="font-medium">Komunal & Harmoni</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 glass rounded-lg padding-responsive">
        <h3 className="text-responsive-lg font-semibold mb-4">
          Koleksi Skrip
        </h3>
        <div className="space-form">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">Progressive Relaxation Script</h4>
                  <p className="text-sm text-muted-foreground">15 Januari 2024 • 45 menit</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded mb-1 block">
                    Aktif
                  </span>
                  <div className="text-xs text-muted-foreground">Skor AI: 92%</div>
                </div>
              </div>
              <p className="text-sm mb-2">
                Skrip relaksasi progresif dengan 7 fase lengkap, disesuaikan untuk klien dengan 
                kecemasan tinggi dan latar belakang budaya tradisional Indonesia.
              </p>
              <div className="text-xs text-muted-foreground">
                Teknik: Progressive Relaxation • Digunakan: 2x • Rating: 9/10
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">Guided Imagery - Pantai Bali</h4>
                  <p className="text-sm text-muted-foreground">10 Januari 2024 • 40 menit</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded mb-1 block">
                    Selesai
                  </span>
                  <div className="text-xs text-muted-foreground">Skor AI: 87%</div>
                </div>
              </div>
              <p className="text-sm mb-2">
                Skrip guided imagery dengan setting pantai Bali yang familiar dengan klien. 
                Mengintegrasikan elemen spiritual Hindu-Bali yang sesuai.
              </p>
              <div className="text-xs text-muted-foreground">
                Teknik: Guided Imagery • Digunakan: 1x • Rating: 8/10
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">Confidence Building Script</h4>
                  <p className="text-sm text-muted-foreground">8 Januari 2024 • 50 menit</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded mb-1 block">
                    Draft
                  </span>
                  <div className="text-xs text-muted-foreground">Skor AI: 84%</div>
                </div>
              </div>
              <p className="text-sm mb-2">
                Skrip untuk membangun kepercayaan diri dengan referensi nilai-nilai 
                kepemimpinan dan keberanian dalam budaya Jawa.
              </p>
              <div className="text-xs text-muted-foreground">
                Teknik: Ego Strengthening • Belum digunakan • Estimasi: 8/10
              </div>
            </div>

            <div className="border rounded-lg p-4 opacity-60">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">Sleep Improvement Script</h4>
                  <p className="text-sm text-muted-foreground">5 Januari 2024 • 35 menit</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded mb-1 block">
                    Arsip
                  </span>
                  <div className="text-xs text-muted-foreground">Skor AI: 78%</div>
                </div>
              </div>
              <p className="text-sm mb-2">
                Skrip awal untuk mengatasi gangguan tidur. Diarsipkan karena fokus terapi 
                berubah ke manajemen kecemasan.
              </p>
              <div className="text-xs text-muted-foreground">
                Teknik: Sleep Induction • Tidak digunakan • -
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}