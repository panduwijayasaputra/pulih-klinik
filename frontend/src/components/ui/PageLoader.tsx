'use client';

import { useNavigation } from '@/hooks/useNavigation';

interface PageLoaderProps {
  children: React.ReactNode;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ children }) => {
  const { isRoleSwitching } = useNavigation();

  if (!isRoleSwitching) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen">
      {/* Loading overlay */}
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">Mengganti Peran</h3>
            <p className="text-sm text-gray-600 mt-1">Mohon tunggu sementara kami memperbarui workspace Anda...</p>
          </div>
        </div>
      </div>
      
      {/* Content (blurred behind overlay) */}
      <div className="opacity-30 pointer-events-none">
        {children}
      </div>
    </div>
  );
};
