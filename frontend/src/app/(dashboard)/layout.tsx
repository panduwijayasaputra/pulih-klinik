import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requireAuth={true} requireVerification={true}>
      <Layout
        showSidebar={true}
        sidebarCollapsed={false}
        header={
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold">Smart Therapy</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Sistem AI Hipnoterapi Indonesia
              </span>
            </div>
          </div>
        }
        sidebar={<DashboardSidebar />}
      >
        {children}
      </Layout>
    </ProtectedRoute>
  );
}