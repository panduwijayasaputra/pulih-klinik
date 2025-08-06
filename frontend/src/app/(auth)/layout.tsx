import { AuthRedirect } from '@/components/auth/auth-redirect';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthRedirect redirectTo="/dashboard">
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="flex min-h-screen items-center justify-center padding-responsive">
          <div className="w-full max-w-md">
            <div className="glass rounded-lg p-8 shadow-strong">
              {children}
            </div>
            
            {/* Indonesian cultural footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                Sistem AI Hipnoterapi Indonesia
              </p>
              <p className="text-xs text-muted-foreground/80">
                Untuk Kesehatan Mental dan Kesejahteraan Masyarakat
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthRedirect>
  );
}