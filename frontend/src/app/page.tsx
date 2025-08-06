export default function HomePage() {
  return (
    <main className='container mx-auto px-4 py-8'>
      <div className='text-center space-y-6'>
        <h1 className='text-4xl font-bold text-gray-900'>Smart Therapy</h1>
        <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
          Sistem AI Hipnoterapi Indonesia - Transformasi perencanaan sesi manual
          2 jam menjadi workflow AI 15 menit
        </p>
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-6 max-w-md mx-auto'>
          <h2 className='text-lg font-semibold text-gray-900 mb-2'>
            Selamat Datang
          </h2>
          <p className='text-gray-600 mb-4'>
            Platform untuk terapis hipnotis Indonesia yang berlisensi
          </p>
          <div className='space-y-2'>
            <button className='bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors w-full'>
              Masuk ke Sistem
            </button>
            <button className='bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-2 px-4 rounded-md transition-colors w-full'>
              Daftar Sebagai Terapis
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
