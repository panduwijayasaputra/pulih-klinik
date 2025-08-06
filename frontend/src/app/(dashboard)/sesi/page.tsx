import type { Metadata } from 'next';
import { MainHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Manajemen Sesi - Smart Therapy',
  description: 'Kelola sesi hipnoterapi dan tracking progress klien',
};

export default function SesiPage() {
  return (
    <div className="space-content">
      <MainHeader
        title="Manajemen Sesi"
        description="Kelola sesi hipnoterapi dan monitor progress klien"
      />

      <div className="responsive-card-grid">
        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Jadwal Sesi
          </h3>
          <p className="text-responsive-sm text-muted-foreground">
            Kelola jadwal sesi mendatang dengan klien
          </p>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Riwayat Sesi
          </h3>
          <p className="text-responsive-sm text-muted-foreground">
            Review sesi sebelumnya dan progress klien
          </p>
        </div>

        <div className="glass rounded-lg padding-responsive">
          <h3 className="text-responsive-lg font-semibold mb-4">
            Analytics
          </h3>
          <p className="text-responsive-sm text-muted-foreground">
            Analisis data sesi dan tingkat keberhasilan terapi
          </p>
        </div>
      </div>

      <div className="mt-8 glass rounded-lg padding-responsive">
        <h3 className="text-responsive-lg font-semibold mb-4">
          Progress Tracking
        </h3>
        <div className="responsive-form-grid gap-responsive">
          <div>
            <h4 className="font-semibold mb-2">Before & After Assessment</h4>
            <p className="text-sm text-muted-foreground">
              Bandingkan kondisi klien sebelum dan sesudah terapi untuk mengukur progress
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Session Notes</h4>
            <p className="text-sm text-muted-foreground">
              Catat observasi dan feedback klien setiap sesi untuk evaluasi berkelanjutan
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Goal Achievement</h4>
            <p className="text-sm text-muted-foreground">
              Track pencapaian tujuan terapi yang ditetapkan di awal treatment
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Success Metrics</h4>
            <p className="text-sm text-muted-foreground">
              Metrik keberhasilan berdasarkan standar hipnoterapi Indonesia
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-responsive-xs text-muted-foreground">
            Fitur manajemen sesi akan diimplementasikan di task selanjutnya
          </p>
        </div>
      </div>
    </div>
  );
}