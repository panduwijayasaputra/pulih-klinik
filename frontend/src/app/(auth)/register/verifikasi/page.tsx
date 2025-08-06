import { Metadata } from 'next';
import { ArrowRight, CheckCircle, Mail } from 'lucide-react';
import { CustomLink } from '@/components/ui/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Email Terverifikasi - Smart Therapy',
  description: 'Email Anda telah berhasil diverifikasi. Selamat datang di Smart Therapy!',
};

export default function EmailVerificationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-purple-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">ST</span>
            </div>
            <span className="text-2xl font-semibold text-gray-900">Smart Therapy</span>
          </div>
        </div>

        {/* Success Card */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              {/* Success Message */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  Email Berhasil Diverifikasi!
                </h2>
                <p className="text-gray-600">
                  Selamat! Akun Anda telah aktif dan siap digunakan.
                </p>
              </div>

              {/* Next Steps */}
              <div className="bg-purple-50 rounded-lg p-4 text-left">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-purple-900 mb-1">
                      Langkah Selanjutnya
                    </p>
                    <p className="text-purple-700">
                      Anda dapat langsung masuk ke dashboard dan mulai menggunakan 
                      fitur-fitur Smart Therapy untuk mengelola praktik terapi Anda.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <CustomLink href="/dashboard" className="flex items-center justify-center space-x-2">
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </CustomLink>
                </Button>

                <CustomLink
                  href="/masuk"
                  variant="ghost"
                  className="w-full text-center hover:bg-gray-100"
                >
                  Masuk dengan Akun Lain
                </CustomLink>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Butuh bantuan? Hubungi tim dukungan kami di{' '}
            <a href="mailto:support@smarttherapy.id" className="text-purple-600 hover:text-purple-500">
              support@smarttherapy.id
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}