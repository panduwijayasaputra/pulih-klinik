'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ConsultationDataErrorBoundary } from './ConsultationErrorBoundary';
import {
  ConsultationSummaryData,
  MentalHealthPrediction,
  MentalHealthIssueLabels,
  TherapyPriorityLabels,
  TherapyTypeLabels,
} from '@/types/therapy';
import { ValidationError } from '@/schemas/therapySchema';
import {
  CpuChipIcon as BrainIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  FlagIcon as TargetIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon as RefreshCwIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

interface ConsultationSummaryProps {
  data?: ConsultationSummaryData;
  isLoading?: boolean;
  error?: string | null;
  validationErrors?: ValidationError[];
  hasValidationIssues?: boolean;
  isDataValid?: boolean;
  onRetry?: () => void;
  className?: string;
}

interface PredictionCardProps {
  prediction: MentalHealthPrediction;
  isPrimary?: boolean;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, isPrimary = false }) => {
  const severityColors = {
    mild: 'bg-green-100 text-green-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    severe: 'bg-red-100 text-red-800',
  };

  const priorityColors = {
    low: 'border-green-200',
    medium: 'border-yellow-200',
    high: 'border-orange-200',
    urgent: 'border-red-200',
  };

  return (
    <Card className={`${priorityColors[prediction.urgencyLevel]} ${isPrimary ? 'ring-2 ring-blue-200' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <BrainIcon className="w-5 h-5 text-blue-600" />
            {MentalHealthIssueLabels[prediction.issue]}
            {isPrimary && (
              <Badge variant="default" className="text-xs">
                Primer
              </Badge>
            )}
          </CardTitle>
          <Badge className={severityColors[prediction.severity]}>
            {prediction.severity === 'mild' ? 'Ringan' : 
             prediction.severity === 'moderate' ? 'Sedang' : 'Berat'}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Tingkat Keyakinan:</span>
          <span className="font-semibold text-blue-600">{prediction.confidence}%</span>
        </div>
        <Progress value={prediction.confidence} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Deskripsi</h4>
          <p className="text-sm text-gray-600">{prediction.description}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Rekomendasi Terapi</h4>
          <ul className="space-y-1">
            {prediction.recommendedTreatment.map((treatment, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                {treatment}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-sm">
            <span className="text-gray-600">Estimasi Sesi:</span>
            <span className="font-medium ml-1">{prediction.estimatedSessionsNeeded}</span>
          </div>
          <Badge variant="outline">
            {TherapyPriorityLabels[prediction.urgencyLevel]}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </CardContent>
    </Card>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32" />
        </CardContent>
      </Card>
    </div>
  </div>
);

const ErrorState: React.FC<{ error: string; onRetry?: () => void }> = ({ error, onRetry }) => (
  <Alert className="border-red-200 bg-red-50">
    <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
    <AlertDescription className="text-red-800">
      <div className="flex items-center justify-between">
        <span>{error}</span>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="ml-4 border-red-200 text-red-700 hover:bg-red-100"
          >
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Coba Lagi
          </Button>
        )}
      </div>
    </AlertDescription>
  </Alert>
);

const ValidationIssuesAlert: React.FC<{ 
  validationErrors: ValidationError[]; 
  onRetry?: () => void;
}> = ({ validationErrors, onRetry }) => (
  <Alert className="border-yellow-200 bg-yellow-50 mb-6">
    <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
    <AlertDescription className="text-yellow-800">
      <div>
        <div className="font-medium mb-2">
          Masalah Validasi Data Terdeteksi ({validationErrors.length} masalah)
        </div>
        <div className="text-sm space-y-1 mb-3">
          {validationErrors.slice(0, 3).map((error, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-1 h-1 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
              <span>{error.path}: {error.message}</span>
            </div>
          ))}
          {validationErrors.length > 3 && (
            <div className="text-xs text-yellow-600">
              ... dan {validationErrors.length - 3} masalah lainnya
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Data akan tetap ditampilkan dengan nilai fallback.</span>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="ml-auto border-yellow-300 text-yellow-700 hover:bg-yellow-100"
            >
              <RefreshCwIcon className="w-4 h-4 mr-2" />
              Muat Ulang
            </Button>
          )}
        </div>
      </div>
    </AlertDescription>
  </Alert>
);

export const ConsultationSummary: React.FC<ConsultationSummaryProps> = ({
  data,
  isLoading = false,
  error = null,
  validationErrors = [],
  hasValidationIssues = false,
  isDataValid = true,
  onRetry,
  className = '',
}) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <DocumentTextIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Tidak ada data konsultasi tersedia</p>
        </CardContent>
      </Card>
    );
  }

  const { consultation, aiPredictions, client, therapist } = data;

  const severityLabels = {
    1: 'Sangat Ringan',
    2: 'Ringan', 
    3: 'Sedang',
    4: 'Berat',
    5: 'Sangat Berat'
  };

  const riskLevelColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const riskLevelLabels = {
    low: 'Rendah',
    medium: 'Sedang',
    high: 'Tinggi',
  };

  const content = (
    <div className={`space-y-6 ${className}`}>
      {/* Validation Issues Alert */}
      {hasValidationIssues && validationErrors.length > 0 && (
        <ValidationIssuesAlert validationErrors={validationErrors} onRetry={onRetry} />
      )}
      
      {/* Consultation Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-blue-600" />
            Ringkasan Konsultasi
          </CardTitle>
          <p className="text-sm text-gray-600">
            Sesi konsultasi untuk {client.fullName} bersama {therapist.fullName}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Tanggal Sesi</span>
              </div>
              <p className="text-sm text-gray-700">
                {new Date(consultation.sessionDate).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ClockIcon className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Durasi</span>
              </div>
              <p className="text-sm text-gray-700">{consultation.sessionDuration} menit</p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ChartBarIcon className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">Tingkat Gejala</span>
              </div>
              <p className="text-sm text-gray-700">
                {severityLabels[consultation.symptomSeverity]} ({consultation.symptomSeverity}/5)
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <UserIcon className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Durasi Gejala</span>
              </div>
              <p className="text-sm text-gray-700">{consultation.symptomDuration}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Keluhan Utama</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {consultation.primaryConcern}
              </p>
            </div>

            {consultation.secondaryConcerns && consultation.secondaryConcerns.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Keluhan Tambahan</h4>
                <div className="flex flex-wrap gap-2">
                  {consultation.secondaryConcerns.map((concern, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {concern}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tujuan Terapi</h4>
              <ul className="space-y-1">
                {consultation.treatmentGoals.map((goal, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <TargetIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Predictions */}
      {aiPredictions && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BrainIcon className="w-5 h-5 text-blue-600" />
              Prediksi AI untuk Kesehatan Mental
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Tingkat Risiko Keseluruhan:</span>
              <Badge className={riskLevelColors[aiPredictions.overallRiskLevel]}>
                {riskLevelLabels[aiPredictions.overallRiskLevel]}
              </Badge>
            </div>
          </div>

          {/* Primary Prediction */}
          <div>
            <h4 className="text-base font-medium text-gray-800 mb-3">Prediksi Utama</h4>
            <PredictionCard prediction={aiPredictions.primaryPrediction} isPrimary={true} />
          </div>

          {/* Secondary Predictions */}
          {aiPredictions.secondaryPredictions.length > 0 && (
            <div>
              <h4 className="text-base font-medium text-gray-800 mb-3">Prediksi Tambahan</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {aiPredictions.secondaryPredictions.map((prediction, index) => (
                  <PredictionCard key={index} prediction={prediction} />
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Rekomendasi Terapi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Jenis Terapi yang Disarankan:</span>
                  <Badge variant="outline" className="ml-2">
                    {TherapyTypeLabels[aiPredictions.recommendedTherapyType]}
                  </Badge>
                </div>
                
                {aiPredictions.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Catatan AI</h4>
                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      {aiPredictions.notes}
                    </p>
                  </div>
                )}

                <div className="text-xs text-gray-500 pt-2 border-t">
                  Prediksi dihasilkan pada: {new Date(aiPredictions.generatedAt).toLocaleString('id-ID')}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Assessment & Notes */}
      {(consultation.initialAssessment || consultation.consultationNotes) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {consultation.initialAssessment && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Penilaian Awal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {consultation.initialAssessment}
                </p>
              </CardContent>
            </Card>
          )}

          {consultation.consultationNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Catatan Konsultasi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {consultation.consultationNotes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );

  // Wrap content in error boundary
  return (
    <ConsultationDataErrorBoundary onRetry={onRetry}>
      {content}
    </ConsultationDataErrorBoundary>
  );
};

export default ConsultationSummary;