'use client';

export const ClinicDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Clinic Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Dashboard Klinik
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola klinik dan tim therapist Anda
          </p>
        </div>
      </div>
    </div>
  );
};