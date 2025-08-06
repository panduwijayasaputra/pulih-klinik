import type { Metadata } from 'next';
import { MainHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Asesmen AI - Smart Therapy',
  description: 'Sistem asesmen AI untuk rekomendasi teknik hipnoterapi',
};

export default function AsesmenPage() {
  return (
    <div className="space-content">
      <MainHeader
        title="Asesmen AI"
        description="Analisis klien dan rekomendasi teknik hipnoterapi berbasis AI"
      />

      <div className="responsive-card-grid">
        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Asesmen Umum
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Evaluasi komprehensif kondisi klien untuk terapi umum
          </p>
          <div className="space-form">
            <div className="text-xs text-muted-foreground">
              ✓ Profil demografis dan latar belakang<br />
              ✓ Riwayat kesehatan mental<br />
              ✓ Preferensi dan kepercayaan<br />
              ✓ Tujuan terapi
            </div>
          </div>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Asesmen Adiksi
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Evaluasi khusus untuk kasus kecanduan dan perilaku kompulsif
          </p>
          <div className="space-form">
            <div className="text-xs text-muted-foreground">
              ✓ Jenis dan tingkat kecanduan<br />
              ✓ Pola perilaku dan trigger<br />
              ✓ Faktor sosial dan lingkungan<br />
              ✓ Motivasi perubahan
            </div>
          </div>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Asesmen Anak
          </h3>
          <p className="text-responsive-sm text-muted-foreground mb-4">
            Evaluasi yang disesuaikan untuk klien berusia di bawah 18 tahun
          </p>
          <div className="space-form">
            <div className="text-xs text-muted-foreground">
              ✓ Tahap perkembangan<br />
              ✓ Lingkungan keluarga<br />
              ✓ Persetujuan orang tua<br />
              ✓ Pendekatan ramah anak
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 glass rounded-lg padding-responsive">
        <h3 className="text-responsive-lg font-semibold mb-4">
          Fitur Asesmen AI
        </h3>
        <div className="responsive-form-grid gap-responsive">
          <div>
            <h4 className="font-semibold mb-2">Rekomendasi Teknik</h4>
            <p className="text-sm text-muted-foreground">
              AI menganalisis profil klien dan merekomendasikan teknik hipnoterapi terbaik dengan skor kompatibilitas 0-100
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Adaptasi Budaya</h4>
            <p className="text-sm text-muted-foreground">
              Menyesuaikan pendekatan berdasarkan latar belakang budaya, agama, dan demografi klien Indonesia
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Prediksi Keberhasilan</h4>
            <p className="text-sm text-muted-foreground">
              Estimasi tingkat keberhasilan terapi berdasarkan profil klien dan teknik yang dipilih
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Rencana Sesi</h4>
            <p className="text-sm text-muted-foreground">
              Memberikan panduan jumlah sesi yang direkomendasikan dan milestone progress
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}