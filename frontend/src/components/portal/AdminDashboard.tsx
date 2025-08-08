'use client';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Panel Administrator
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola sistem Terapintar secara keseluruhan
          </p>
        </div>
      </div>
    </div>
  );
};