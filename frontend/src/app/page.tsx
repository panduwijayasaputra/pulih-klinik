import type { Route } from 'next';
import { CustomLink } from '@/components/ui/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  LightBulbIcon,
  PlayIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">TP</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Terapintar</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#fitur" className="text-gray-600 hover:text-gray-900">Fitur</a>
              <a href="#cara-kerja" className="text-gray-600 hover:text-gray-900">Cara Kerja</a>
              <a href="#harga" className="text-gray-600 hover:text-gray-900">Harga</a>
              <a href="#bantuan" className="text-gray-600 hover:text-gray-900">Bantuan</a>
            </div>

            <div className="flex items-center space-x-4">
              <CustomLink href={'/login' as Route} variant="ghost" className="text-gray-600">
                Masuk
              </CustomLink>
              <CustomLink href={'/register' as Route} className="bg-purple-600 hover:bg-purple-700 text-white">
                Daftar
              </CustomLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Masa Depan
                <br />
                <span className="text-purple-600">Hipnoterapi AI</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Platform canggih yang mentransformasi sesi perencanaan manual 2 jam menjadi workflow AI-assisted 15 menit untuk terapis Indonesia berlisensi.
              </p>

              <div className="flex items-center space-x-4 mb-12">
                <CustomLink
                  href={'/daftar' as Route}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3"
                >
                  Mulai Sekarang
                </CustomLink>
                <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 p-0">
                  <div className="w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <PlayIcon className="w-4 h-4 ml-1" />
                  </div>
                  <span>Lihat Demo</span>
                </Button>
              </div>

              {/* Partner Logos */}
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-gray-600">
                  <ShieldCheckIcon className="w-4 h-4 mr-2" />
                  HIPAA
                </Badge>
                <Badge variant="outline" className="text-gray-600">
                  <DocumentTextIcon className="w-4 h-4 mr-2" />
                  ISO 27001
                </Badge>
                <Badge variant="outline" className="text-gray-600">
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  AI-Powered
                </Badge>
              </div>
            </div>

            {/* Right Content - Dashboard Preview */}
            <div className="relative">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-blue-50">
                <CardContent className="p-0">
                  <Card className="bg-white rounded-xl p-6 mb-4 border-0">
                    <CardHeader className="p-0 pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Analytics Sesi</CardTitle>
                        <span className="text-sm text-gray-500">Real-time</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-2xl font-bold text-purple-600">847</div>
                          <div className="text-sm text-gray-600">Total Sesi</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">24.5k</div>
                          <div className="text-sm text-gray-600">Menit Terapi</div>
                        </div>
                      </div>

                      {/* Session Progress */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircleIcon className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Sesi Assessment</span>
                          </div>
                          <span className="text-sm text-green-600 font-semibold">Selesai</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <DocumentTextIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Skrip Terapi</span>
                          </div>
                          <span className="text-sm text-blue-600 font-semibold">Selesai</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <PlayIcon className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Sesi Hipnoterapi</span>
                          </div>
                          <span className="text-sm text-purple-600 font-semibold">Berikutnya</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <ChartBarIcon className="w-4 h-4 text-gray-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-400">Evaluasi</span>
                          </div>
                          <span className="text-sm text-gray-400">Menunggu</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bottom Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="p-4">
                      <CardContent className="p-0">
                        <div className="text-lg font-bold text-gray-900">45</div>
                        <div className="text-sm text-gray-600">Klien Aktif</div>
                      </CardContent>
                    </Card>
                    <Card className="p-4">
                      <CardContent className="p-0">
                        <div className="text-lg font-bold text-gray-900">98%</div>
                        <div className="text-sm text-gray-600">Kepuasan</div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Dark Features Section */}
      <section className="py-20 bg-slate-900" id="fitur">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Dari data ke keputusan
          </h2>
          <p className="text-lg text-slate-300 mb-16 max-w-2xl mx-auto">
            Semua yang Anda butuhkan untuk mengelola klien dan sesi terapi—dibangun untuk menjadi sederhana, aman, dan cerdas.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="bg-slate-800 border-slate-700 rounded-2xl p-8 text-left">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <DocumentTextIcon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-white mb-4">
                  Asesmen Komprehensif
                </CardTitle>
                <CardDescription className="text-slate-300 mb-6">
                  Sistem asesmen digital yang mengkategorikan masalah klien dengan akurat dan menunjukkan fokus terapi yang tepat.
                </CardDescription>
                <Card className="bg-slate-700 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300">Progress Asesmen</span>
                      <span className="text-sm font-semibold text-white">87%</span>
                    </div>
                    <Progress value={87} className="w-full" />
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-slate-800 border-slate-700 rounded-2xl p-8 text-left">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <LightBulbIcon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-white mb-4">
                  AI Rekomendasi Cerdas
                </CardTitle>
                <CardDescription className="text-slate-300 mb-6">
                  Algoritma AI yang memberikan rekomendasi teknik hipnoterapi yang dipersonalisasi berdasarkan profil dan kondisi klien.
                </CardDescription>
                <Card className="bg-slate-700 border-slate-600">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">Progressive Relaxation</span>
                        <Badge variant="success" className="text-xs">95%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300">Guided Imagery</span>
                        <Badge variant="success" className="text-xs">87%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-slate-800 border-slate-700 rounded-2xl p-8 text-left">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                  <DocumentDuplicateIcon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-white mb-4">
                  Generator Skrip Otomatis
                </CardTitle>
                <CardDescription className="text-slate-300 mb-6">
                  Hasilkan skrip sesi hipnoterapi profesional dalam 7 fase dengan AI yang disesuaikan untuk budaya Indonesia.
                </CardDescription>
                <Card className="bg-slate-700 border-slate-600">
                  <CardContent className="p-4">
                    <div className="text-xs text-slate-400 mb-1">Fase 1: Persiapan</div>
                    <div className="text-sm text-slate-200">"Mari kita mulai dengan posisi yang nyaman..."</div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Simple and Powerful Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Fitur kami sederhana dan powerful
          </h2>
          <p className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto">
            Semua yang Anda butuhkan untuk mengelola klien dan sesi terapi dalam satu platform yang terintegrasi.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Feature Description */}
            <div className="text-left">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Lacak metrik yang tepat dengan zero setup
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Sistem tracking otomatis yang memantau progress terapi klien Anda tanpa perlu konfigurasi rumit. Dapatkan insight mendalam dalam hitungan detik.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Tracking progress otomatis</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Dashboard real-time</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Laporan komprehensif</span>
                </div>
              </div>

              <CustomLink href="/daftar" className="mt-8 bg-purple-600 hover:bg-purple-700 text-white">
                Coba Gratis
              </CustomLink>
            </div>

            {/* Right - Chart Mockup */}
            <div className="relative">
              <Card className="p-6 shadow-xl">
                <CardHeader className="p-0 pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Metrik Terapi</CardTitle>
                    <span className="text-sm text-gray-500">Minggu ini</span>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Chart bars mockup */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-sm text-gray-600">Sen</div>
                      <div className="flex-1">
                        <Progress value={85} className="h-3" />
                      </div>
                      <div className="w-8 text-sm text-gray-900 font-medium">85</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-sm text-gray-600">Sel</div>
                      <div className="flex-1">
                        <Progress value={72} className="h-3" />
                      </div>
                      <div className="w-8 text-sm text-gray-900 font-medium">72</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-sm text-gray-600">Rab</div>
                      <div className="flex-1">
                        <Progress value={90} className="h-3" />
                      </div>
                      <div className="w-8 text-sm text-gray-900 font-medium">90</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-sm text-gray-600">Kam</div>
                      <div className="flex-1">
                        <Progress value={65} className="h-3" />
                      </div>
                      <div className="w-8 text-sm text-gray-900 font-medium">65</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-sm text-gray-600">Jum</div>
                      <div className="flex-1">
                        <Progress value={78} className="h-3" />
                      </div>
                      <div className="w-8 text-sm text-gray-900 font-medium">78</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Why Love Section */}
      <section className="py-20 bg-white" id="cara-kerja">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mengapa Anda akan menyukai Terapintar
          </h2>
          <p className="text-lg text-gray-600 mb-16 max-w-3xl mx-auto">
            Platform yang dirancang khusus untuk kebutuhan terapis Indonesia dengan pendekatan yang mudah dan efektif.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Setup 2 Menit
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Daftar dan mulai menggunakan platform dalam hitungan menit tanpa konfigurasi yang rumit.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                AI yang Dapat Diandalkan
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Algoritma AI yang telah dilatih khusus untuk konteks budaya dan praktik hipnoterapi Indonesia.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Keamanan Terjamin
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Data klien Anda dilindungi dengan enkripsi tingkat enterprise dan compliance HIPAA.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Komunitas Terapis
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Bergabung dengan komunitas terapis Indonesia untuk berbagi pengalaman dan best practices.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <DocumentTextIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Dokumentasi Lengkap
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Panduan lengkap dan dokumentasi yang mudah dipahami untuk memaksimalkan penggunaan platform.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Analytics Mendalam
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Laporan analytics yang memberikan insight mendalam tentang progress dan efektivitas terapi.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Pricing Section */}
      <section className="py-20 bg-white" id="harga">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pilih Paket yang Tepat untuk Klinik Anda
          </h2>
          <p className="text-lg text-gray-600 mb-16 max-w-3xl mx-auto">
            Skalakan praktik terapi Anda dengan paket yang fleksibel dan terjangkau. Semua paket termasuk fitur AI lengkap dan dukungan teknis.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Beta Plan */}
            <Card className="relative border-2 border-gray-200 hover:border-purple-300 transition-colors">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900">Beta</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">Rp 30k</span>
                  <span className="text-gray-600">/bulan</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Cocok untuk praktik kecil</p>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">1 Terapis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">1 Klien Baru/hari</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">1 Skrip/klien/sesi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">10 Teknik Rekomendasi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Deteksi Masalah Mental</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Dukungan Email</span>
                  </li>
                </ul>
                <CustomLink
                  href="/daftar"
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Mulai Beta
                </CustomLink>
              </CardContent>
            </Card>

            {/* Alpha Plan */}
            <Card className="relative border-2 border-purple-500 shadow-lg">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-600 text-white px-3 py-1 text-xs font-medium">
                  Paling Populer
                </Badge>
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900">Alpha</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">Rp 50k</span>
                  <span className="text-gray-600">/bulan</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Ideal untuk klinik menengah</p>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">2 Terapis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">4 Klien Baru/hari</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">2 Skrip/klien/sesi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">25 Teknik Rekomendasi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Deteksi Masalah Mental</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Analytics Lanjutan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Dukungan Prioritas</span>
                  </li>
                </ul>
                <CustomLink
                  href="/daftar"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Mulai Alpha
                </CustomLink>
              </CardContent>
            </Card>

            {/* Theta Plan */}
            <Card className="relative border-2 border-gray-200 hover:border-purple-300 transition-colors">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900">Theta</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">Rp 100k</span>
                  <span className="text-gray-600">/bulan</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Untuk klinik berkembang</p>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">4 Terapis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">15 Klien Baru/hari</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">3 Skrip/klien/sesi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">40 Teknik Rekomendasi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Deteksi Masalah Mental</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Analytics Lanjutan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Integrasi API</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Dukungan Telepon</span>
                  </li>
                </ul>
                <CustomLink
                  href="/daftar"
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Mulai Theta
                </CustomLink>
              </CardContent>
            </Card>

            {/* Delta Plan */}
            <Card className="relative border-2 border-gray-200 hover:border-purple-300 transition-colors">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900">Delta</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">Rp 150k</span>
                  <span className="text-gray-600">/bulan</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Untuk klinik besar</p>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">6 Terapis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">30 Klien Baru/hari</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">5 Skrip/klien/sesi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Semua 67 Teknik</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Deteksi Masalah Mental</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Analytics Enterprise</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Integrasi API Lengkap</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Dedicated Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Custom Branding</span>
                  </li>
                </ul>
                <CustomLink
                  href="/daftar"
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Mulai Delta
                </CustomLink>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-4">
              Semua paket termasuk fitur dasar: Asesmen AI, Rekomendasi Teknik, dan Generator Skrip
            </p>
            <p className="text-sm text-gray-500">
              * Harga dalam Rupiah Indonesia. Pembayaran bulanan. Dapat dibatalkan kapan saja.
            </p>
          </div>
        </div>
      </section>

      <Separator />

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Dipercaya oleh Tim Marketing
          </h2>
          <p className="text-lg text-gray-600 mb-16 max-w-3xl mx-auto">
            Ribuan terapis Indonesia telah mempercayai Smart Therapy untuk meningkatkan efektivitas praktik mereka.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="p-8 text-left shadow-sm">
              <CardContent className="p-0">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <Badge variant="success" className="ml-2 text-xs">+95%</Badge>
                </div>
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "Platform ini benar-benar mengubah cara saya mengelola praktik. Yang tadinya butuh 2 jam untuk persiapan, sekarang hanya 15 menit."
                </blockquote>
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-purple-100 text-purple-600 text-sm font-semibold">DR</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Dr. Rina Sari</p>
                    <p className="text-gray-500 text-xs">Hipnoterapis - Jakarta</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="p-8 text-left shadow-sm">
              <CardContent className="p-0">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <Badge variant="success" className="ml-2 text-xs">+90%</Badge>
                </div>
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "AI rekomendasi sangat akurat dan sesuai dengan konteks budaya Indonesia. Klien saya juga merasa lebih nyaman."
                </blockquote>
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">AP</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Ahmad Pratama</p>
                    <p className="text-gray-500 text-xs">Psikolog - Bandung</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="p-8 text-left shadow-sm">
              <CardContent className="p-0">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <Badge variant="success" className="ml-2 text-xs">+92%</Badge>
                </div>
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "Dokumentasi dan tracking yang sistematis membuat saya lebih percaya diri dalam memberikan terapi kepada klien."
                </blockquote>
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-green-100 text-green-600 text-sm font-semibold">SW</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Sari Wulandari</p>
                    <p className="text-gray-500 text-xs">Konselor - Surabaya</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Setup Terapintar dalam 2 Menit
          </h2>
          <p className="text-lg text-purple-100 mb-8">
            Mulai transformasi praktik terapi Anda hari ini dengan platform yang dirancang khusus untuk terapis Indonesia.
          </p>
          <CustomLink
            href="/daftar"
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
          >
            Mulai Gratis Sekarang
          </CustomLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Company */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Perusahaan</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Karir</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Investor</a></li>
              </ul>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Produk</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#fitur" className="hover:text-gray-900 transition-colors">Fitur</a></li>
                <li><a href="#harga" className="hover:text-gray-900 transition-colors">Harga</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Keamanan</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Enterprise</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Sumber Daya</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Dokumentasi</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Tutorial</a></li>
                <li><a href="#bantuan" className="hover:text-gray-900 transition-colors">Bantuan</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Privasi</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Cookies</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Lisensi</a></li>
              </ul>
            </div>

            {/* Logo and Copyright */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TP</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">Terapintar</span>
              </div>
              <p className="text-gray-600 text-sm">
                © 2025 Terapintar.<br />
                Semua Hak Dilindungi.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
