'use client';

export const TherapistDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Therapist Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Dashboard Therapist
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola klien dan sesi terapi harian Anda
          </p>
        </div>
      </div>
    </div>
  );
};