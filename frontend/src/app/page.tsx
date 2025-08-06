import Link from 'next/link';
import type { Route } from 'next';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="container-responsive padding-responsive">
      <div className="text-center space-cultural">
        <div className="professional-gradient bg-clip-text text-transparent">
          <h1 className="text-responsive-2xl font-bold">
            Smart Therapy
          </h1>
        </div>
        <p className="text-responsive-lg text-muted-foreground max-w-3xl mx-auto">
          Sistem AI Hipnoterapi Indonesia - Transformasi perencanaan sesi manual
          2 jam menjadi workflow AI 15 menit untuk terapis berlisensi
        </p>
        
        <div className="glass rounded-lg padding-responsive max-w-md mx-auto">
          <h2 className="text-responsive-lg font-semibold mb-2">
            Selamat Datang
          </h2>
          <p className="text-responsive-sm text-muted-foreground mb-6">
            Platform profesional untuk terapis hipnoterapi Indonesia yang berlisensi
          </p>
          
          <div className="space-form">
            <Button asChild className="w-full btn-touch">
              <Link href={'/masuk' as Route}>
                Masuk ke Sistem
              </Link>
            </Button>
            
            <Button asChild variant="secondary" className="w-full btn-touch">
              <Link href={'/daftar' as Route}>
                Daftar Sebagai Terapis
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-responsive-xs text-muted-foreground">
            Sistem AI Hipnoterapi Indonesia
          </p>
          <p className="text-responsive-xs text-muted-foreground/80">
            Untuk Kesehatan Mental dan Kesejahteraan Masyarakat
          </p>
        </div>
      </div>
    </main>
  );
}
