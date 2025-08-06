import type { Metadata } from 'next';
import { MainHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Manajemen Klien - Smart Therapy',
  description: 'Kelola profil dan data klien hipnoterapi',
};

export default function KlienPage() {
  return (
    <div className="space-content">
      <MainHeader
        title="Manajemen Klien"
        description="Kelola profil dan riwayat klien hipnoterapi Anda"
      />

      <div className="glass rounded-lg padding-responsive">
        <div className="text-center space-form">
          <h3 className="text-responsive-lg font-semibold">
            Daftar Klien
          </h3>
          <p className="text-responsive-sm text-muted-foreground">
            Halaman manajemen klien akan diimplementasikan di task selanjutnya
          </p>
        </div>
      </div>
    </div>
  );
}