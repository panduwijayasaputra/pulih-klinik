import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daftar - Smart Therapy',
  description: 'Daftar sebagai terapis hipnoterapi berlisensi di Indonesia',
};

export default function DaftarPage() {
  return (
    <div className="container-md space-content">
      <div className="text-center space-form">
        <h1 className="text-responsive-2xl font-bold text-foreground">
          Daftar Terapis
        </h1>
        <p className="text-responsive-base text-muted-foreground">
          Bergabung dengan sistem AI Hipnoterapi Indonesia
        </p>
      </div>

      <div className="space-form">
        <div className="text-center">
          <p className="text-responsive-sm text-muted-foreground">
            Halaman registrasi akan diimplementasikan di task selanjutnya
          </p>
          <p className="text-responsive-xs text-muted-foreground mt-2">
            * Hanya untuk terapis hipnoterapi berlisensi
          </p>
        </div>
      </div>
    </div>
  );
}