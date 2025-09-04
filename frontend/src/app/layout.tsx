import './globals.css';
import { Poppins } from 'next/font/google';
import type { Metadata } from 'next';
import { ToastProvider } from '@/components/ui/toast';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
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
    default: 'Terapintar - Sistem AI Hipnoterapi Indonesia',
    template: '%s | Terapintar',
  },
  description:
    'Terapintar: Platform AI untuk terapis hipnotis Indonesia - Transformasi perencanaan sesi manual 2 jam menjadi workflow AI 15 menit',
  keywords: [
    'hipnoterapi',
    'indonesia',
    'ai',
    'terapi',
    'kesehatan mental',
    'klinik',
    'digitalisasi',
    'workflow',
    'terapintar',
  ],
  authors: [{ name: 'Terapintar Team' }],
  creator: 'Terapintar Team',
  publisher: 'Terapintar',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://smart-therapy.id'),
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
    url: 'https://smart-therapy.id',
    title: 'Terapintar - Sistem AI Hipnoterapi Indonesia',
    description: 'Terapintar: Platform AI untuk terapis hipnotis Indonesia - Transformasi digital hipnoterapi',
    siteName: 'Terapintar',
    images: [
      {
        url: 'https://smart-therapy.id/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Terapintar - Sistem AI Hipnoterapi Indonesia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terapintar - Sistem AI Hipnoterapi Indonesia',
    description: 'Terapintar: Platform AI untuk terapis hipnotis Indonesia - Transformasi digital hipnoterapi',
    images: ['https://smart-therapy.id/og-image.png'],
    creator: '@smarttherapyid',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='id' className={poppins.variable}>
      <body className='min-h-screen bg-background font-sans antialiased'>
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              <div className='relative flex min-h-screen flex-col'>
                <div className='flex-1'>{children}</div>
              </div>
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
