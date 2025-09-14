import './globals.css';
import { Poppins } from 'next/font/google';
import type { Metadata } from 'next';
import { ToastProvider } from '@/components/ui/toast';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { TestModeBanner } from '@/components/common/TestModeBanner';
import { disableConsoleInProduction } from '@/lib/security-utils';

// Disable console logs in production for security
if (typeof window !== 'undefined') {
  disableConsoleInProduction();
}

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Pulih Klinik - Sistem AI Hipnoterapi Indonesia',
    template: '%s | Pulih Klinik',
  },
  description:
    'Pulih Klinik: Platform AI untuk terapis hipnotis Indonesia - Transformasi perencanaan sesi manual 2 jam menjadi workflow AI 15 menit',
  keywords: [
    'hipnoterapi',
    'indonesia',
    'ai',
    'terapi',
    'kesehatan mental',
    'klinik',
    'digitalisasi',
    'workflow',
    'pulih klinik',
  ],
  authors: [{ name: 'Pulih Klinik Team' }],
  creator: 'Pulih Klinik Team',
  publisher: 'Pulih Klinik',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://pulih-klinik.id'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: false, // Private healthcare application
    follow: false,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://pulih-klinik.id',
    title: 'Pulih Klinik - Sistem AI Hipnoterapi Indonesia',
    description: 'Pulih Klinik: Platform AI untuk terapis hipnotis Indonesia - Transformasi digital hipnoterapi',
    siteName: 'Pulih Klinik',
    images: [
      {
        url: 'https://pulih-klinik.id/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pulih Klinik - Sistem AI Hipnoterapi Indonesia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pulih Klinik - Sistem AI Hipnoterapi Indonesia',
    description: 'Pulih Klinik: Platform AI untuk terapis hipnotis Indonesia - Transformasi digital hipnoterapi',
    images: ['https://pulih-klinik.id/og-image.png'],
    creator: '@pulihklinikid',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='id' className={poppins.variable}>
      <body className='min-h-screen bg-background font-sans antialiased' suppressHydrationWarning={true}>
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              <div className='relative flex min-h-screen flex-col'>
                <div className='flex-1'>{children}</div>
                <TestModeBanner />
              </div>
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
