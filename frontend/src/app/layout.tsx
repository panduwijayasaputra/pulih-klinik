import './globals.css';
import { Poppins } from 'next/font/google';
import type { Metadata } from 'next';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Smart Therapy - Sistem AI Hipnoterapi Indonesia',
    template: '%s | Smart Therapy',
  },
  description:
    'Platform AI untuk terapis hipnotis Indonesia - Transformasi perencanaan sesi manual 2 jam menjadi workflow AI 15 menit',
  keywords: ['hipnoterapi', 'indonesia', 'ai', 'terapi', 'kesehatan mental'],
  authors: [{ name: 'Smart Therapy Team' }],
  creator: 'Smart Therapy Team',
  publisher: 'Smart Therapy',
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
    url: '/',
    title: 'Smart Therapy - Sistem AI Hipnoterapi Indonesia',
    description: 'Platform AI untuk terapis hipnotis Indonesia',
    siteName: 'Smart Therapy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Therapy - Sistem AI Hipnoterapi Indonesia',
    description: 'Platform AI untuk terapis hipnotis Indonesia',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='id' className={poppins.variable}>
      <body className='min-h-screen bg-background font-sans antialiased'>
        <div className='relative flex min-h-screen flex-col'>
          <div className='flex-1'>{children}</div>
        </div>
      </body>
    </html>
  );
}
