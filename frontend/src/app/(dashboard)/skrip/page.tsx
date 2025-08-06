import type { Metadata } from 'next';
import { MainHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Generator Skrip - Smart Therapy',
  description: 'Generate skrip hipnoterapi 7 fase berdasarkan asesmen AI',
};

export default function SkripPage() {
  return (
    <div className="space-content">
      <MainHeader
        title="Generator Skrip Hipnoterapi"
        description="Buat skrip sesi hipnoterapi 7 fase berbasis AI"
      />

      <div className="glass rounded-lg padding-responsive mb-6">
        <h3 className="text-responsive-lg font-semibold mb-4">
          Sistem 7 Fase Hipnoterapi
        </h3>
        <div className="responsive-grid gap-responsive">
          <div className="space-form">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">1</span>
              </div>
              <h4 className="font-semibold">Persiapan</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Menciptakan lingkungan yang nyaman dan membangun rapport dengan klien
            </p>
          </div>

          <div className="space-form">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">2</span>
              </div>
              <h4 className="font-semibold">Induksi</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Membimbing klien menuju state hipnotis yang sesuai dengan preferensi mereka
            </p>
          </div>

          <div className="space-form">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">3</span>
              </div>
              <h4 className="font-semibold">Deepening</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Memperdalam state hipnotis untuk meningkatkan receptivitas suggestion
            </p>
          </div>

          <div className="space-form">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">4</span>
              </div>
              <h4 className="font-semibold">Suggestion</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Memberikan suggestion terapeutik yang disesuaikan dengan tujuan klien
            </p>
          </div>

          <div className="space-form">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">5</span>
              </div>
              <h4 className="font-semibold">Ego Strengthening</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Memperkuat kepercayaan diri dan kemampuan klien untuk mencapai tujuan
            </p>
          </div>

          <div className="space-form">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">6</span>
              </div>
              <h4 className="font-semibold">Future Pacing</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Membimbing klien membayangkan implementasi perubahan di masa depan
            </p>
          </div>

          <div className="space-form">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">7</span>
              </div>
              <h4 className="font-semibold">Emergence</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Membimbing klien kembali ke state normal dengan perasaan segar dan positif
            </p>
          </div>
        </div>
      </div>

      <div className="responsive-form-grid gap-responsive">
        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Generator Skrip Baru
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Buat skrip berdasarkan hasil asesmen klien
          </p>
          <p className="text-xs text-muted-foreground">
            Fitur akan diimplementasikan di task selanjutnya
          </p>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Template Skrip
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Koleksi template berdasarkan jenis kasus
          </p>
          <div className="space-form">
            <div className="text-xs text-muted-foreground">
              ✓ Anxiety & Stress<br />
              ✓ Smoking Cessation<br />
              ✓ Weight Management<br />
              ✓ Confidence Building<br />
              ✓ Sleep Disorders<br />
              ✓ Pain Management
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}