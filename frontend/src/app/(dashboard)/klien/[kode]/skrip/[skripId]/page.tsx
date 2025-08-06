import type { Metadata } from 'next';
import { MainHeader } from '@/components/layout';

interface SkripDetailPageProps {
  params: {
    kode: string;
    skripId: string;
  };
}

export function generateMetadata({ params }: SkripDetailPageProps): Metadata {
  return {
    title: `Skrip ${params.skripId.toUpperCase()} - Klien ${params.kode.toUpperCase()} - Smart Therapy`,
    description: `Detail skrip hipnoterapi ${params.skripId.toUpperCase()} untuk klien ${params.kode.toUpperCase()}`,
  };
}

export default function SkripDetailPage({ params }: SkripDetailPageProps) {
  return (
    <div className="space-content">
      <MainHeader
        title={`Skrip ${params.skripId.toUpperCase()}`}
        description={`Detail skrip untuk klien ${params.kode.toUpperCase()}`}
      />

      <div className="responsive-form-grid gap-responsive">
        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Informasi Skrip
          </h3>
          <div className="space-form text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground">ID Skrip:</span>
                <div className="font-mono font-semibold">{params.skripId.toUpperCase()}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Klien:</span>
                <div className="font-mono font-semibold">{params.kode.toUpperCase()}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Teknik Utama:</span>
                <div>Progressive Relaxation</div>
              </div>
              <div>
                <span className="text-muted-foreground">Durasi:</span>
                <div>45 menit</div>
              </div>
              <div>
                <span className="text-muted-foreground">Skor AI:</span>
                <div className="text-primary font-semibold">92%</div>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                  Aktif
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Adaptasi Budaya
          </h3>
          <div className="space-form text-sm">
            <div className="space-y-3">
              <div>
                <span className="text-muted-foreground block mb-1">Konteks Religius:</span>
                <div className="bg-muted/20 rounded p-2">
                  Islam - Konservatif. Menggunakan referensi ketenangan dan kedamaian 
                  yang selaras dengan nilai-nilai spiritual.
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Imagery Setting:</span>
                <div className="bg-muted/20 rounded p-2">
                  Pantai Parangtritis dengan suasana senja, angin sepoi-sepoi, 
                  dan suara ombak yang menenangkan.
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Bahasa:</span>
                <div className="bg-muted/20 rounded p-2">
                  Indonesia formal dengan sentuhan bahasa Jawa halus untuk 
                  memberikan nuansa familiar dan nyaman.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 glass rounded-lg padding-responsive">
        <h3 className="text-responsive-lg font-semibold mb-4">
          Struktur 7 Fase Hipnoterapi
        </h3>
        <div className="space-form">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">1</span>
                </div>
                <div>
                  <h4 className="font-semibold">Fase Persiapan</h4>
                  <p className="text-sm text-muted-foreground">Durasi: 5 menit</p>
                </div>
              </div>
              <p className="text-sm mb-2">
                Membangun rapport dan menciptakan lingkungan yang aman. Menjelaskan proses 
                hipnoterapi dengan referensi budaya yang familiar.
              </p>
              <div className="text-xs text-muted-foreground">
                • Pengenalan dan building trust<br />
                • Penjelasan proses sesuai konteks budaya<br />
                • Konfirmasi kenyamanan dan persetujuan
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">2</span>
                </div>
                <div>
                  <h4 className="font-semibold">Fase Induksi</h4>
                  <p className="text-sm text-muted-foreground">Durasi: 8 menit</p>
                </div>
              </div>
              <p className="text-sm mb-2">
                Membimbing klien menuju state rileks dengan teknik pernapasan dan 
                relaksasi otot progresif yang disesuaikan dengan preferensi budaya.
              </p>
              <div className="text-xs text-muted-foreground">
                • Teknik pernapasan dengan counting dalam Bahasa Indonesia<br />
                • Progressive muscle relaxation dari ujung kaki ke kepala<br />
                • Penggunaan metafora alam Indonesia untuk relaksasi
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">3</span>
                </div>
                <div>
                  <h4 className="font-semibold">Fase Deepening</h4>
                  <p className="text-sm text-muted-foreground">Durasi: 7 menit</p>
                </div>
              </div>
              <p className="text-sm mb-2">
                Memperdalam state hipnotis menggunakan teknik countdown dan imagery 
                tangga menuju pantai yang tenang dan damai.
              </p>
              <div className="text-xs text-muted-foreground">
                • Countdown dari 10 ke 1 dengan setiap angka memperdalam relaksasi<br />
                • Imagery turun tangga menuju pantai Parangtritis<br />
                • Penguatan state dengan suara alam Indonesia
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">4</span>
                </div>
                <div>
                  <h4 className="font-semibold">Fase Suggestion</h4>
                  <p className="text-sm text-muted-foreground">Durasi: 15 menit</p>
                </div>
              </div>
              <p className="text-sm mb-2">
                Memberikan suggestion terapeutik untuk mengatasi kecemasan dengan 
                menggunakan kekuatan dalam diri dan dukungan spiritual.
              </p>
              <div className="text-xs text-muted-foreground">
                • Suggestion untuk ketenangan batin sesuai nilai spiritual<br />
                • Penguatan kemampuan mengatasi tantangan hidup<br />
                • Instalasi anchor state untuk situasi stres masa depan
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">5</span>
                </div>
                <div>
                  <h4 className="font-semibold">Fase Ego Strengthening</h4>
                  <p className="text-sm text-muted-foreground">Durasi: 5 menit</p>
                </div>
              </div>
              <p className="text-sm mb-2">
                Memperkuat kepercayaan diri dan self-esteem dengan referensi 
                nilai-nilai kearifan lokal dan kekuatan karakter Indonesia.
              </p>
              <div className="text-xs text-muted-foreground">
                • Penguatan dengan nilai-nilai gotong royong dan kebersamaan<br />
                • Affirmasi positif dalam konteks budaya Indonesia<br />
                • Membangun resiliensi dengan wisdom leluhur
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">6</span>
                </div>
                <div>
                  <h4 className="font-semibold">Fase Future Pacing</h4>
                  <p className="text-sm text-muted-foreground">Durasi: 3 menit</p>
                </div>
              </div>
              <p className="text-sm mb-2">
                Membimbing klien membayangkan penerapan perubahan positif dalam 
                kehidupan sehari-hari di lingkungan Indonesia.
              </p>
              <div className="text-xs text-muted-foreground">
                • Visualisasi situasi stres di masa depan dengan respon baru<br />
                • Penerapan teknik coping dalam konteks sosial Indonesia<br />
                • Reinforcement perubahan perilaku positif
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">7</span>
                </div>
                <div>
                  <h4 className="font-semibold">Fase Emergence</h4>
                  <p className="text-sm text-muted-foreground">Durasi: 2 menit</p>
                </div>
              </div>
              <p className="text-sm mb-2">
                Membimbing klien kembali ke keadaan normal dengan perasaan segar, 
                energik, dan penuh kepercayaan diri.
              </p>
              <div className="text-xs text-muted-foreground">
                • Counting up dari 1 ke 5 untuk emergence<br />
                • Reactivation sistem tubuh secara bertahap<br />
                • Closing dengan doa atau affirmasi sesuai keyakinan
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 glass rounded-lg padding-responsive">
        <h3 className="text-responsive-lg font-semibold mb-4">
          Data Penggunaan
        </h3>
        <div className="responsive-form-grid gap-responsive">
          <div>
            <h4 className="font-semibold mb-2">Riwayat Penggunaan</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 bg-muted/20 rounded">
                <span>15 Jan 2024, 14:00</span>
                <span className="text-primary font-medium">Rating: 9/10</span>
              </div>
              <div className="flex justify-between p-2 bg-muted/20 rounded">
                <span>12 Jan 2024, 15:30</span>
                <span className="text-secondary font-medium">Rating: 8/10</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Efektivitas</h4>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Rata-rata Rating:</span>
                <span className="font-semibold text-primary">8.5/10</span>
              </div>
              <div className="flex justify-between">
                <span>Tingkat Keberhasilan:</span>
                <span className="font-semibold text-secondary">92%</span>
              </div>
              <div className="flex justify-between">
                <span>Feedback Klien:</span>
                <span className="font-semibold text-primary">Sangat Positif</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}