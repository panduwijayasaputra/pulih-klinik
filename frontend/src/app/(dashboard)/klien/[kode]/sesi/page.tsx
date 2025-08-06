import type { Metadata } from 'next';
import { MainHeader } from '@/components/layout';

interface KlienSesiPageProps {
  params: {
    kode: string;
  };
}

export function generateMetadata({ params }: KlienSesiPageProps): Metadata {
  return {
    title: `Sesi Klien ${params.kode.toUpperCase()} - Smart Therapy`,
    description: `Riwayat dan jadwal sesi hipnoterapi untuk klien ${params.kode.toUpperCase()}`,
  };
}

export default function KlienSesiPage({ params }: KlienSesiPageProps) {
  return (
    <div className="space-content">
      <MainHeader
        title={`Sesi Klien ${params.kode.toUpperCase()}`}
        description="Riwayat dan manajemen sesi hipnoterapi"
      />

      <div className="responsive-card-grid">
        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Sesi Mendatang
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Jadwal sesi hipnoterapi selanjutnya
          </p>
          <div className="space-form">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-primary">Sesi #4</h4>
                  <p className="text-sm text-muted-foreground">20 Januari 2024</p>
                </div>
                <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                  Terjadwal
                </span>
              </div>
              <p className="text-sm mb-2">
                Sesi lanjutan dengan focus pada teknik Progressive Relaxation
              </p>
              <div className="text-xs text-muted-foreground">
                Waktu: 14:00 - 15:30 • Durasi: 90 menit
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Progress Terapi
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Kemajuan pencapaian tujuan terapi
          </p>
          <div className="space-form">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Tingkat Kecemasan</span>
                  <span className="text-primary font-medium">65% ↓</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Kualitas Tidur</span>
                  <span className="text-secondary font-medium">80% ↑</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Kepercayaan Diri</span>
                  <span className="text-secondary font-medium">70% ↑</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Statistik Sesi
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Ringkasan data sesi yang telah dilakukan
          </p>
          <div className="space-form">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">3</div>
                <div className="text-xs text-muted-foreground">Sesi Selesai</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">270</div>
                <div className="text-xs text-muted-foreground">Menit Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">8.5</div>
                <div className="text-xs text-muted-foreground">Rata-rata Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">2</div>
                <div className="text-xs text-muted-foreground">Sesi Tersisa</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 glass rounded-lg padding-responsive">
        <h3 className="text-responsive-lg font-semibold mb-4">
          Riwayat Sesi
        </h3>
        <div className="space-form">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">Sesi #3 - Progressive Relaxation</h4>
                  <p className="text-sm text-muted-foreground">15 Januari 2024, 14:00</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded mb-1 block">
                    Selesai
                  </span>
                  <div className="text-xs text-muted-foreground">Rating: 9/10</div>
                </div>
              </div>
              <p className="text-sm mb-2">
                Sesi berfokus pada teknik relaksasi progresif dengan adaptasi budaya Indonesia. 
                Klien menunjukkan respon yang sangat baik.
              </p>
              <div className="text-xs text-muted-foreground">
                Durasi: 90 menit • Teknik: Progressive Relaxation • Feedback: Sangat Positif
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">Sesi #2 - Guided Imagery</h4>
                  <p className="text-sm text-muted-foreground">10 Januari 2024, 15:30</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded mb-1 block">
                    Selesai
                  </span>
                  <div className="text-xs text-muted-foreground">Rating: 8/10</div>
                </div>
              </div>
              <p className="text-sm mb-2">
                Implementasi teknik guided imagery dengan tema alam Indonesia. 
                Klien mulai menunjukkan peningkatan dalam manajemen kecemasan.
              </p>
              <div className="text-xs text-muted-foreground">
                Durasi: 90 menit • Teknik: Guided Imagery • Feedback: Positif
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">Sesi #1 - Intake & Assessment</h4>
                  <p className="text-sm text-muted-foreground">5 Januari 2024, 10:00</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded mb-1 block">
                    Selesai
                  </span>
                  <div className="text-xs text-muted-foreground">Rating: 8/10</div>
                </div>
              </div>
              <p className="text-sm mb-2">
                Sesi intake awal dengan assessment komprehensif. Membangun rapport 
                dan memahami latar belakang budaya klien.
              </p>
              <div className="text-xs text-muted-foreground">
                Durasi: 90 menit • Teknik: Assessment • Feedback: Baik
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}