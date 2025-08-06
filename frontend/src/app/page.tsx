import Link from 'next/link';
import type { Route } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/layout/navbar';
import { 
  DocumentTextIcon,
  LightBulbIcon,
  DocumentDuplicateIcon,
  UserGroupIcon,
  ClockIcon,
  ShieldCheckIcon,
  BoltIcon,
  SparklesIcon,
  FlagIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 lg:pt-20 lg:pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
                Smart Therapy
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Sistem AI Hipnoterapi Indonesia
              </p>
              <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Transformasi perencanaan sesi manual 2 jam menjadi workflow AI 15 menit 
                dengan konten yang sesuai budaya Indonesia untuk terapis berlisensi
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link href={'/masuk' as Route}>
                  Masuk ke Sistem
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-3">
                <Link href={'/daftar' as Route}>
                  Daftar Sebagai Terapis
                </Link>
              </Button>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-semibold text-lg mb-2">Efisiensi Tinggi</h3>
                <p className="text-gray-600">Dari 2 jam menjadi 15 menit</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="font-semibold text-lg mb-2">AI Cerdas</h3>
                <p className="text-gray-600">Rekomendasi teknik yang tepat</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="text-3xl mb-3">🇮🇩</div>
                <h3 className="font-semibold text-lg mb-2">Budaya Indonesia</h3>
                <p className="text-gray-600">Konten sesuai budaya lokal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fitur Utama Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Solusi lengkap untuk terapis hipnoterapi Indonesia dalam mengelola klien dan sesi terapi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Sistem Asesmen Digital</CardTitle>
                <CardDescription>
                  Form asesmen digital dengan 3 jenis: Umum, Kecanduan, dan Minor. 
                  Analisis mendalam dengan skala emosional 0-10 untuk 20 emosi berbeda.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <LightBulbIcon className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>AI Rekomendasi Teknik</CardTitle>
                <CardDescription>
                  Algoritma AI cerdas untuk menganalisis asesmen dan memberikan rekomendasi 
                  teknik hipnoterapi yang optimal dengan pertimbangan budaya Indonesia.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <DocumentDuplicateIcon className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Generator Skrip Sesi</CardTitle>
                <CardDescription>
                  Generate skrip sesi lengkap 7 fase dalam bahasa Indonesia. 
                  Dapat diekspor ke PDF untuk digunakan langsung dalam sesi terapi.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <UserGroupIcon className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Manajemen Klien</CardTitle>
                <CardDescription>
                  Sistem manajemen klien terintegrasi dengan profil lengkap, 
                  riwayat asesmen, dan tracking progress terapi.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <ClockIcon className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Manajemen Sesi</CardTitle>
                <CardDescription>
                  Penjadwalan dan tracking sesi terapi dengan checklist evaluasi 
                  dan catatan progress untuk setiap klien.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <ShieldCheckIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>Keamanan & Privasi</CardTitle>
                <CardDescription>
                  Sistem keamanan tingkat tinggi dengan enkripsi data, 
                  autentikasi terapis berlisensi, dan perlindungan privasi klien.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Workflow AI yang Efisien
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dari asesmen hingga skrip sesi dalam 15 menit
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Asesmen Digital</h3>
              <p className="text-gray-600">Form asesmen lengkap dengan skala emosional</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">AI Analisis</h3>
              <p className="text-gray-600">Analisis mendalam dengan algoritma AI</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Rekomendasi</h3>
              <p className="text-gray-600">Rekomendasi teknik optimal</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Skrip Sesi</h3>
              <p className="text-gray-600">Generate skrip 7 fase siap pakai</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Siap Memulai?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan terapis hipnoterapi Indonesia lainnya dalam 
            revolusi digital kesehatan mental
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-3">
              <Link href={'/daftar' as Route}>
                Daftar Sekarang
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600">
              <Link href={'/masuk' as Route}>
                Masuk ke Sistem
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">Smart Therapy</p>
          <p className="text-gray-400 mb-4">Sistem AI Hipnoterapi Indonesia</p>
          <p className="text-sm text-gray-500">
            Untuk Kesehatan Mental dan Kesejahteraan Masyarakat Indonesia
          </p>
        </div>
      </footer>
    </div>
  );
}
