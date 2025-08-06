import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Masuk - Smart Therapy',
  description: 'Masuk ke sistem AI Hipnoterapi Indonesia untuk terapis berlisensi',
};

export default function MasukPage() {
  return (
    <div className="container-md space-content">
      <div className="text-center space-form">
        <h1 className="text-responsive-2xl font-bold text-foreground">
          Masuk ke Smart Therapy
        </h1>
        <p className="text-responsive-base text-muted-foreground">
          Sistem AI Hipnoterapi untuk Terapis Berlisensi Indonesia
        </p>
      </div>

      <div className="space-form">
        <div className="text-center">
          <p className="text-responsive-sm text-muted-foreground">
            Halaman masuk akan diimplementasikan di task selanjutnya
          </p>
        </div>
      </div>
    </div>
  );
}