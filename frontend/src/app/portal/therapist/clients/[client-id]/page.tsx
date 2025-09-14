'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormModal } from '@/components/ui/form-modal';
import { Input } from '@/components/ui/input';
import { ConsultationForm } from '@/components/consultation/ConsultationForm';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/useAuth';
import { useTherapistClient } from '@/hooks/useTherapistClient';
import { useTherapySession } from '@/hooks/useTherapySession';
import { ClientStatusLabels, ClientGenderEnum, ConsultationStatusEnum } from '@/types/enums';
import { ClientStatusColors } from '@/types/clientStatus';
import type { TherapistClient } from '@/types/therapistClient';
// import { consultationSchema, type ConsultationFormData } from '@/schemas/consultationSchema'; // Replaced by consultationFormSchema
import { consultationFormSchema, type ConsultationFormSchemaType } from '@/schemas/consultationFormSchema';
import { getConsultationByClientId } from '@/lib/mocks/consultation';
import { mockSessionHistory, mockTherapySessions } from '@/lib/mocks/therapySession';
import { TherapySessionStatusEnum } from '@/types/therapySession';
import {
  CalendarIcon,
  ClockIcon,
  HeartIcon,
  DocumentTextIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  PencilIcon,
  XMarkIcon,
  PlusIcon,
  CheckIcon,
  SparklesIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  TagIcon,
  WrenchScrewdriverIcon,
  LightBulbIcon,
  CpuChipIcon,
  HomeIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  CakeIcon,
  HeartIcon as HeartHandshakeIcon,
  UserGroupIcon,
  IdentificationIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
  StarIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  BuildingStorefrontIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  ClockIcon as ClockIconSolid,
  UserIcon as GenderIcon
} from '@heroicons/react/24/outline';

export default function ClientTherapyPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const { user } = useAuth();
  const { loadClient, selectedClient, loading: clientLoading, error: clientError } = useTherapistClient();
  const {
    sessions: therapySessions,
    loading: sessionsLoading,
    loadingPredictions: generatingPredictions,
    aiPredictions,
    loadSessions,
    createSession,
    updateSession,
    generatePredictions,
    setPredictions
  } = useTherapySession();

  const clientId = params['client-id'] as string;

  // Get consultation data for this client (one per client)
  const clientConsultation = getConsultationByClientId(clientId);

  // Consultation form state
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [consultationSubmitting, setConsultationSubmitting] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState(false);

  // Therapy session state
  const [showSessionSetup, setShowSessionSetup] = useState(false);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [selectedIssues, setSelectedIssues] = useState<Array<{ id: string; name: string; confidence?: number }>>([]);
  const [selectedTechniques, setSelectedTechniques] = useState<Array<{ id: string; name: string; effectiveness?: number }>>([]);
  const [newIssue, setNewIssue] = useState('');

  // Cancel session state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingSession, setCancellingSession] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Continue session state
  const [showContinueDialog, setShowContinueDialog] = useState(false);
  const [continuingSession, setContinuingSession] = useState<string | null>(null);

  // Start session confirmation state
  const [showStartConfirmation, setShowStartConfirmation] = useState(false);
  const [startingSession, setStartingSession] = useState<string | null>(null);

  // Session save confirmation state
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [savingSession, setSavingSession] = useState(false);

  // Session collapse state
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());

  // Session form data
  const [sessionFormData, setSessionFormData] = useState({
    sessionNumber: 0,
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0] || '',
    time: new Date().toTimeString().slice(0, 5),
    duration: 90 as number | undefined
  });

  // Use mock session history from the mock data (unused for now)
  // const mockSessions = mockSessionHistory;

  // Initialize consultation form
  const consultationForm = useForm<ConsultationFormSchemaType>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      clientId: clientId,
      therapistId: user?.id || '',
      formTypes: [],
      status: ConsultationStatusEnum.Draft,
      sessionDate: new Date().toISOString().split('T')[0] || '',
      sessionDuration: 60,
      consultationNotes: '',
      scriptGenerationPreferences: '',
      previousTherapyExperience: false,
      previousTherapyDetails: '',
      currentMedications: false,
      currentMedicationsDetails: '',
      previousPsychologicalDiagnosis: false,
      previousPsychologicalDiagnosisDetails: '',
      significantPhysicalIllness: false,
      significantPhysicalIllnessDetails: '',
      traumaticExperience: false,
      traumaticExperienceDetails: '',
      familyPsychologicalHistory: false,
      familyPsychologicalHistoryDetails: '',
      primaryConcern: 'Assessment awal klien untuk evaluasi kondisi psikologis dan kebutuhan terapi.',
      secondaryConcerns: [],
      symptomSeverity: 3,
      symptomDuration: '1-2 bulan',
      emotionScale: undefined,
      recentMoodState: undefined,
      recentMoodStateDetails: '',
      frequentEmotions: [],
      selfHarmThoughts: undefined,
      selfHarmDetails: '',
      dailyStressFrequency: undefined,
      treatmentGoals: ['Meningkatkan kesejahteraan psikologis klien'],
      clientExpectations: '',
      initialAssessment: '',
      recommendedTreatmentPlan: '',
      consentAgreement: false,
      clientSignatureName: '',
      clientSignatureDate: '',
      therapistName: '',
      registrationDate: '',
      initialRecommendation: [],
    },
  });

  // Load client data on mount
  useEffect(() => {
    if (clientId && user?.id) {
      loadClient(clientId);
    }
  }, [clientId, user?.id, loadClient]);

  // Load sessions when client is found
  useEffect(() => {
    if (selectedClient && clientId) {
      loadSessions(clientId);
    }
  }, [selectedClient, clientId, loadSessions]);

  // Set default expanded session
  useEffect(() => {
    if (therapySessions.length > 0) {
      const sortedSessions = [...therapySessions].sort((a, b) => a.sessionNumber - b.sessionNumber);

      // Find the last completed session
      const lastCompletedSession = sortedSessions
        .filter(s => s.status === TherapySessionStatusEnum.Completed)
        .pop();

      let sessionToExpand: string | null = null;

      if (lastCompletedSession) {
        // Find the next session after the last completed session
        const nextSession = sortedSessions.find(s =>
          s.sessionNumber > lastCompletedSession.sessionNumber
        );
        if (nextSession) {
          sessionToExpand = nextSession.id;
        }
      } else {
        // If no completed sessions, expand the first session
        sessionToExpand = sortedSessions[0]?.id || null;
      }

      if (sessionToExpand) {
        setExpandedSessions(new Set([sessionToExpand]));
      }
    }
  }, [therapySessions]);

  // Tab state management
  const [activeTab, setActiveTab] = useState('summary');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle tab change with data refresh
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'sessions' && selectedClient && clientId) {
      setIsRefreshing(true);
      loadSessions(clientId).finally(() => {
        setIsRefreshing(false);
      });
    }
  };

  // Handle client loading error
  useEffect(() => {
    if (clientError) {
      addToast({
        type: 'error',
        title: 'Klien Tidak Ditemukan',
        message: 'Data klien tidak ditemukan atau Anda tidak memiliki akses',
      });
      router.push('/portal/therapist/clients');
    }
  }, [clientError, addToast, router]);

  const handleBackToClients = () => {
    router.push('/portal/therapist/clients');
  };

  // Consultation form handlers
  const handleStartConsultation = useCallback(() => {
    setEditingConsultation(false);
    consultationForm.reset({
      clientId: clientId,
      therapistId: user?.id || '',
      formTypes: [],
      status: ConsultationStatusEnum.Draft,
      sessionDate: new Date().toISOString().split('T')[0] || '',
      sessionDuration: 60,
      consultationNotes: '',
      scriptGenerationPreferences: '',
      previousTherapyExperience: false,
      previousTherapyDetails: '',
      currentMedications: false,
      currentMedicationsDetails: '',
      previousPsychologicalDiagnosis: false,
      previousPsychologicalDiagnosisDetails: '',
      significantPhysicalIllness: false,
      significantPhysicalIllnessDetails: '',
      traumaticExperience: false,
      traumaticExperienceDetails: '',
      familyPsychologicalHistory: false,
      familyPsychologicalHistoryDetails: '',
      primaryConcern: 'Assessment awal klien untuk evaluasi kondisi psikologis dan kebutuhan terapi.',
      secondaryConcerns: [],
      symptomSeverity: 3,
      symptomDuration: '1-2 bulan',
      emotionScale: undefined,
      recentMoodState: undefined,
      recentMoodStateDetails: '',
      frequentEmotions: [],
      selfHarmThoughts: undefined,
      selfHarmDetails: '',
      dailyStressFrequency: undefined,
      treatmentGoals: ['Meningkatkan kesejahteraan psikologis klien'],
      clientExpectations: '',
      initialAssessment: '',
      recommendedTreatmentPlan: '',
      consentAgreement: false,
      clientSignatureName: '',
      clientSignatureDate: '',
      therapistName: '',
      registrationDate: '',
      initialRecommendation: [],
    });
    setShowConsultationForm(true);
  }, [clientId, user?.id, consultationForm]);

  const handleEditConsultation = useCallback(() => {
    if (clientConsultation) {
      setEditingConsultation(true);
      consultationForm.reset(clientConsultation);
      setShowConsultationForm(true);
    }
  }, [clientConsultation, consultationForm]);

  const handleConsultationSubmit = useCallback(async (data: ConsultationFormSchemaType) => {
    setConsultationSubmitting(true);
    try {
      // console.log('Consultation Data:', data);

      // TODO: Call API to save consultation
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay

      addToast({
        type: 'success',
        title: 'Konsultasi Tersimpan',
        message: 'Data konsultasi berhasil disimpan.',
      });

      setShowConsultationForm(false);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Gagal Menyimpan',
        message: 'Terjadi kesalahan saat menyimpan konsultasi.',
      });
    } finally {
      setConsultationSubmitting(false);
    }
  }, [addToast]);

  // Therapy session handlers
  const handleStartTherapySession = useCallback(async () => {
    if (!clientConsultation) return;

    const nextSessionNumber = Math.max(...therapySessions.map(s => s.sessionNumber), 0) + 1;
    const isFirstSession = therapySessions.length === 0;

    // Reset form data
    setSessionFormData({
      sessionNumber: nextSessionNumber,
      title: isFirstSession ? 'Sesi Terapi Awal' : `Sesi Terapi #${nextSessionNumber}`,
      description: isFirstSession ? 'Sesi terapi pertama berdasarkan hasil assessment' : '',
      date: '', // Allow empty for new sessions
      time: '',
      duration: undefined
    });

    setEditingSession(null);
    setShowSessionSetup(true);

    // Only generate AI predictions for first session
    if (isFirstSession) {
      try {
        const success = await generatePredictions(clientId);
        if (success && aiPredictions) {
          setSelectedIssues(aiPredictions.issues.slice(0, 3)); // Select top 3 issues by default
          setSelectedTechniques(aiPredictions.techniques.slice(0, 2)); // Select top 2 techniques by default
        }
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Gagal Generate Prediksi',
          message: 'Terjadi kesalahan saat menganalisis data klien.',
        });
      }
    } else {
      // For subsequent sessions, no AI generation
      setSelectedIssues([]);
      setSelectedTechniques([]);
    }
  }, [clientConsultation, therapySessions, clientId, generatePredictions, aiPredictions, addToast]);

  const handleEditSession = useCallback((sessionId: string) => {
    const session = therapySessions.find(s => s.id === sessionId);
    if (!session) return;

    setEditingSession(sessionId);
    setSessionFormData({
      sessionNumber: session.sessionNumber,
      title: session.title,
      description: session.description || '',
      date: session.date || '',
      time: session.time,
      duration: session.duration
    });
    setShowSessionSetup(true);
    // Loading state is handled by the hook
    setPredictions(null);
    setSelectedIssues([]);
    setSelectedTechniques([]);
  }, [therapySessions]);

  const handleStartScheduledSession = useCallback(async (sessionId: string) => {
    const session = therapySessions.find(s => s.id === sessionId);
    if (!session) return;

    // Check if previous session is completed
    const previousSessions = therapySessions
      .filter(s => s.sessionNumber < session.sessionNumber)
      .sort((a, b) => b.sessionNumber - a.sessionNumber);

    if (previousSessions.length > 0) {
      const lastSession = previousSessions[0];
      if (lastSession && lastSession.status !== 'completed') {
        addToast({
          type: 'error',
          title: 'Sesi Sebelumnya Belum Selesai',
          message: `Selesaikan sesi #${lastSession.sessionNumber} terlebih dahulu sebelum memulai sesi ini.`,
        });
        return;
      }
    }

    addToast({
      type: 'success',
      title: 'Sesi Terapi Dimulai',
      message: `Memulai "${session.title}" dengan teknik yang telah direncanakan.`,
    });

    // TODO: Navigate to actual therapy session or implement session logic
    console.log('Starting scheduled session:', session);
  }, [therapySessions, addToast]);

  // Issue management handlers
  const handleRemoveIssue = useCallback((issueId: string) => {
    setSelectedIssues(prev => prev.filter(issue => issue.id !== issueId));
  }, []);

  const handleAddNewIssue = useCallback(() => {
    if (newIssue.trim()) {
      const newId = `custom-${Date.now()}`;
      setSelectedIssues(prev => [...prev, { id: newId, name: newIssue.trim() }]);
      setNewIssue('');
    }
  }, [newIssue]);

  const handleAddPredictedIssue = useCallback((issue: { id: string; name: string; confidence: number }) => {
    if (!selectedIssues.find(selected => selected.id === issue.id)) {
      setSelectedIssues(prev => [...prev, issue]);
    }
  }, [selectedIssues]);

  // Technique management handlers
  const handleRemoveTechnique = useCallback((techniqueId: string) => {
    setSelectedTechniques(prev => prev.filter(technique => technique.id !== techniqueId));
  }, []);

  const handleToggleTechnique = useCallback((technique: { id: string; name: string; effectiveness: number }) => {
    setSelectedTechniques(prev => {
      const exists = prev.find(selected => selected.id === technique.id);
      if (exists) {
        return prev.filter(selected => selected.id !== technique.id);
      } else {
        return [...prev, technique];
      }
    });
  }, []);

  // Cancel session handlers
  const handleCancelSession = useCallback((sessionId: string) => {
    setCancellingSession(sessionId);
    setCancelReason('');
    setShowCancelModal(true);
  }, []);

  const handleConfirmCancel = useCallback(async () => {
    if (!cancellingSession || !cancelReason.trim()) return;

    const success = await updateSession(cancellingSession, {
      status: TherapySessionStatusEnum.Cancelled,
      notes: `Sesi dibatalkan. Alasan: ${cancelReason.trim()}`
    });

    if (success) {
      addToast({
        type: 'success',
        title: 'Sesi Dibatalkan',
        message: 'Sesi berhasil dibatalkan.',
      });
      setShowCancelModal(false);
      setCancellingSession(null);
      setCancelReason('');
    } else {
      addToast({
        type: 'error',
        title: 'Gagal Membatalkan Sesi',
        message: 'Terjadi kesalahan saat membatalkan sesi.',
      });
    }
  }, [cancellingSession, cancelReason, updateSession, addToast]);

  // Continue session handlers
  const handleContinueSession = useCallback((sessionId: string) => {
    setContinuingSession(sessionId);
    setShowContinueDialog(true);
  }, []);

  const handleConfirmContinue = useCallback(async () => {
    if (!continuingSession) return;

    const success = await updateSession(continuingSession, {
      status: TherapySessionStatusEnum.Completed,
      notes: 'Sesi dilanjutkan dan diselesaikan.'
    });

    if (success) {
      addToast({
        type: 'success',
        title: 'Sesi Diselesaikan',
        message: 'Sesi berhasil diselesaikan.',
      });
      setShowContinueDialog(false);
      setContinuingSession(null);
    } else {
      addToast({
        type: 'error',
        title: 'Gagal Menyelesaikan Sesi',
        message: 'Terjadi kesalahan saat menyelesaikan sesi.',
      });
    }
  }, [continuingSession, updateSession, addToast]);

  // Start session confirmation handlers
  const handleStartSessionClick = useCallback((sessionId: string) => {
    setStartingSession(sessionId);
    setShowStartConfirmation(true);
  }, []);

  const handleConfirmStart = useCallback(() => {
    if (startingSession) {
      handleStartScheduledSession(startingSession);
      setShowStartConfirmation(false);
      setStartingSession(null);
    }
  }, [startingSession]);

  // Session collapse handlers
  const toggleSessionExpansion = useCallback((sessionId: string) => {
    setExpandedSessions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sessionId)) {
        // If clicking on already expanded session, collapse it
        newSet.delete(sessionId);
      } else {
        // If clicking on collapsed session, expand it and collapse all others
        newSet.clear();
        newSet.add(sessionId);
      }
      return newSet;
    });
  }, []);

  // Session setup handlers
  const handleShowSaveConfirmation = useCallback(() => {
    setShowSaveConfirmation(true);
  }, []);

  const handleConfirmSave = useCallback(async () => {
    setSavingSession(true);
    const isFirstSession = therapySessions.length === 0;

    if (editingSession) {
      // Update existing session
      const success = await updateSession(editingSession, {
        title: sessionFormData.title,
        description: sessionFormData.description,
        date: sessionFormData.date || '',
        time: sessionFormData.time,
        duration: sessionFormData.duration,
      });

      if (success) {
        addToast({
          type: 'success',
          title: 'Sesi Diperbarui',
          message: `Sesi "${sessionFormData.title}" berhasil diperbarui.`,
        });
        setShowSessionSetup(false);
        setEditingSession(null);
        setShowSaveConfirmation(false);
      }
    } else {
      // Determine status based on date, time, and duration (all three must be filled)
      const hasDateAndTimeAndDuration = sessionFormData.date && sessionFormData.time && sessionFormData.duration;
      const status = hasDateAndTimeAndDuration ? TherapySessionStatusEnum.Scheduled : TherapySessionStatusEnum.Planned;

      // Create new session
      const success = await createSession({
        clientId,
        therapistId: user?.id || '',
        title: sessionFormData.title,
        description: sessionFormData.description,
        date: sessionFormData.date || '',
        time: sessionFormData.time,
        ...(sessionFormData.duration && { duration: sessionFormData.duration }),
        status,
        ...(isFirstSession && {
          issues: selectedIssues.map(i => i.name),
          techniques: selectedTechniques.map(t => t.name)
        })
      });

      if (success) {
        addToast({
          type: 'success',
          title: 'Sesi Dijadwalkan',
          message: `Sesi "${sessionFormData.title}" berhasil dijadwalkan untuk ${sessionFormData.date ? new Date(sessionFormData.date).toLocaleDateString('id-ID') : 'tanggal yang dipilih'} ${sessionFormData.time}.`,
        });
        setShowSessionSetup(false);
        setEditingSession(null);
        setShowSaveConfirmation(false);
      }
    }
    setSavingSession(false);
  }, [sessionFormData, selectedIssues, selectedTechniques, therapySessions, editingSession, clientId, user?.id, createSession, updateSession, addToast, setShowSaveConfirmation]);

  const handleSaveSession = useCallback(async () => {
    const isFirstSession = therapySessions.length === 0;

    if (editingSession) {
      // Update existing session
      const success = await updateSession(editingSession, {
        title: sessionFormData.title,
        description: sessionFormData.description,
        date: sessionFormData.date || '',
        time: sessionFormData.time,
        duration: sessionFormData.duration,
      });

      if (success) {
        addToast({
          type: 'success',
          title: 'Sesi Diperbarui',
          message: `Sesi "${sessionFormData.title}" berhasil diperbarui.`,
        });
        setShowSessionSetup(false);
        setEditingSession(null);
      }
    } else {
      // Determine status based on date, time, and duration (all three must be filled)
      const hasDateAndTimeAndDuration = sessionFormData.date && sessionFormData.time && sessionFormData.duration;
      const status = hasDateAndTimeAndDuration ? TherapySessionStatusEnum.Scheduled : TherapySessionStatusEnum.Planned;

      // Create new session
      const success = await createSession({
        clientId,
        therapistId: user?.id || '',
        title: sessionFormData.title,
        description: sessionFormData.description,
        date: sessionFormData.date || '',
        time: sessionFormData.time,
        ...(sessionFormData.duration && { duration: sessionFormData.duration }),
        status,
        ...(isFirstSession && {
          issues: selectedIssues.map(i => i.name),
          techniques: selectedTechniques.map(t => t.name)
        })
      });

      if (success) {
        addToast({
          type: 'success',
          title: 'Sesi Dijadwalkan',
          message: `Sesi "${sessionFormData.title}" berhasil dijadwalkan untuk ${sessionFormData.date ? new Date(sessionFormData.date).toLocaleDateString('id-ID') : 'tanggal yang dipilih'} ${sessionFormData.time}.`,
        });
        setShowSessionSetup(false);
        setEditingSession(null);
      }
    }
  }, [sessionFormData, selectedIssues, selectedTechniques, therapySessions, editingSession, clientId, user?.id, createSession, updateSession, addToast]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  if (clientLoading) {
    return (
      <PageWrapper
        title="Terapi Klien"
        showBackButton
        onBackClick={handleBackToClients}
        backButtonLabel="Kembali ke Daftar Klien"
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Memuat data klien...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (!selectedClient) {
    return (
      <PageWrapper
        title="Terapi Klien"
        showBackButton
        onBackClick={handleBackToClients}
        backButtonLabel="Kembali ke Daftar Klien"
      >
        <div className="text-center py-12">
          <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Klien Tidak Ditemukan</h3>
          <p className="text-gray-600">Data klien tidak tersedia atau Anda tidak memiliki akses.</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={`Terapi - ${selectedClient.fullName}`}
      description="Kelola sesi terapi dan progres klien"
      showBackButton
      onBackClick={handleBackToClients}
      backButtonLabel="Kembali ke Daftar Klien"
      actions={[]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="" alt={selectedClient.fullName} />
                  <AvatarFallback className="text-lg">
                    {getInitials(selectedClient.fullName)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{selectedClient.fullName}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-2">
                <Badge variant="outline" className={`bg-${ClientStatusColors[selectedClient.status]}-50 text-${ClientStatusColors[selectedClient.status]}-700 border-${ClientStatusColors[selectedClient.status]}-200`}>
                  {ClientStatusLabels[selectedClient.status]}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <UserIcon className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">Usia:</span>
                  <span className="ml-auto font-medium">{formatAge(selectedClient.birthDate)} tahun</span>
                </div>

                <div className="flex items-center text-sm">
                  <GenderIcon className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">Jenis Kelamin:</span>
                  <span className="ml-auto font-medium">
                    {selectedClient.gender === ClientGenderEnum.Male ? 'Laki-laki' : 'Perempuan'}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <PhoneIcon className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">Telepon:</span>
                  <span className="ml-auto font-medium">{selectedClient.phone}</span>
                </div>

                <div className="flex items-center text-sm">
                  <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-auto font-medium text-xs">{selectedClient.email}</span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-600">Bergabung:</span>
                    <span className="ml-auto font-medium">
                      {new Date(selectedClient.joinDate).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <div className="flex items-center text-sm">
                    <ClockIcon className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-600">Total Sesi:</span>
                    <span className="ml-auto font-medium">{selectedClient.sessionCount || selectedClient.totalSessions || 0}</span>
                  </div>

                  {(selectedClient.lastSessionDate || selectedClient.lastSession) && (
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600">Sesi Terakhir:</span>
                      <span className="ml-auto font-medium">
                        {new Date(selectedClient.lastSessionDate || selectedClient.lastSession || '').toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Progres Terapi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Tingkat Progres</span>
                    <span className="font-medium">{selectedClient.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${selectedClient.progress || 0}%` }}
                    />
                  </div>
                </div>
                {(selectedClient.progressNotes || selectedClient.notes) && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <DocumentTextIcon className="w-4 h-4" />
                      Catatan Progres:
                    </label>
                    <p className="text-sm text-gray-800 mt-1 p-3 bg-gray-50 rounded-lg">
                      {selectedClient.progressNotes || selectedClient.notes}
                    </p>
                  </div>
                )}
                {selectedClient.therapistNotes && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <ChatBubbleLeftRightIcon className="w-4 h-4" />
                      Catatan Therapist:
                    </label>
                    <p className="text-sm text-gray-800 mt-1 p-3 bg-blue-50 rounded-lg">
                      {selectedClient.therapistNotes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Ringkasan</TabsTrigger>
              <TabsTrigger value="consultation">Konsultasi</TabsTrigger>
              <TabsTrigger value="sessions">Sesi Terapi</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-6">
              {/* Client Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Detail Klien</CardTitle>
                  <CardDescription>
                    Informasi lengkap tentang klien
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Tempat, Tanggal Lahir</label>
                        <p className="text-gray-900 flex items-center gap-2">
                          <CakeIcon className="w-4 h-4 text-gray-400" />
                          {selectedClient.birthPlace}, {new Date(selectedClient.birthDate).toLocaleDateString('id-ID')}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">Agama</label>
                        <p className="text-gray-900 flex items-center gap-2">
                          <HeartIcon className="w-4 h-4 text-gray-400" />
                          {selectedClient.religion}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">Pekerjaan</label>
                        <p className="text-gray-900 flex items-center gap-2">
                          <BriefcaseIcon className="w-4 h-4 text-gray-400" />
                          {selectedClient.occupation}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">Pendidikan</label>
                        <p className="text-gray-900 flex items-center gap-2">
                          <AcademicCapIcon className="w-4 h-4 text-gray-400" />
                          {selectedClient.education}
                          {selectedClient.educationMajor && ` - ${selectedClient.educationMajor}`}
                        </p>
                      </div>

                      {/* Primary Issue */}
                      {selectedClient.primaryIssue && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Masalah Utama</label>
                          <p className="text-gray-900 flex items-center gap-2">
                            <ExclamationTriangleIcon className="w-4 h-4 text-gray-400" />
                            {selectedClient.primaryIssue}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Alamat</label>
                        <p className="text-gray-900 flex items-start gap-2">
                          <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span>{selectedClient.address}</span>
                        </p>
                      </div>


                      <div>
                        <label className="text-sm font-medium text-gray-600">Hobi</label>
                        <p className="text-gray-900 flex items-center gap-2">
                          <StarIcon className="w-4 h-4 text-gray-400" />
                          {selectedClient.hobbies}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">Status Pernikahan</label>
                        <p className="text-gray-900 flex items-center gap-2">
                          <HeartHandshakeIcon className="w-4 h-4 text-gray-400" />
                          {selectedClient.maritalStatus}
                        </p>
                      </div>

                      {/* Spouse Information */}
                      {selectedClient.spouseName && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Nama Pasangan</label>
                          <p className="text-gray-900 flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-gray-400" />
                            {selectedClient.spouseName}
                          </p>
                        </div>
                      )}

                      {selectedClient.relationshipWithSpouse && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Hubungan dengan Pasangan</label>
                          <p className="text-gray-900 flex items-center gap-2">
                            <UserGroupIcon className="w-4 h-4 text-gray-400" />
                            {selectedClient.relationshipWithSpouse}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Minor Information */}
                  {selectedClient.isMinor && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <BookOpenIcon className="w-4 h-4" />
                          Informasi Anak/Remaja
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedClient.school && (
                            <div>
                              <label className="text-sm font-medium text-gray-600">Sekolah</label>
                              <p className="text-gray-900 flex items-center gap-2">
                                <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                                {selectedClient.school}
                              </p>
                            </div>
                          )}
                          {selectedClient.grade && (
                            <div>
                              <label className="text-sm font-medium text-gray-600">Kelas</label>
                              <p className="text-gray-900 flex items-center gap-2">
                                <AcademicCapIcon className="w-4 h-4 text-gray-400" />
                                {selectedClient.grade}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Guardian Information */}
                  {selectedClient.guardianFullName && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <ShieldCheckIcon className="w-4 h-4" />
                          Informasi Wali
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Nama Wali:</span>
                            <span className="ml-2 font-medium">{selectedClient.guardianFullName}</span>
                          </div>
                          {selectedClient.guardianRelationship && (
                            <div className="flex items-center gap-2">
                              <UserGroupIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">Hubungan:</span>
                              <span className="ml-2 font-medium">{selectedClient.guardianRelationship}</span>
                            </div>
                          )}
                          {selectedClient.guardianPhone && (
                            <div className="flex items-center gap-2">
                              <PhoneIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">Telepon:</span>
                              <span className="ml-2 font-medium">{selectedClient.guardianPhone}</span>
                            </div>
                          )}
                          {selectedClient.guardianOccupation && (
                            <div className="flex items-center gap-2">
                              <BriefcaseIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">Pekerjaan:</span>
                              <span className="ml-2 font-medium">{selectedClient.guardianOccupation}</span>
                            </div>
                          )}
                          {selectedClient.guardianAddress && (
                            <div className="md:col-span-2 flex items-start gap-2">
                              <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">Alamat:</span>
                              <span className="ml-2 font-medium">{selectedClient.guardianAddress}</span>
                            </div>
                          )}
                          {selectedClient.guardianMaritalStatus && (
                            <div className="flex items-center gap-2">
                              <HeartHandshakeIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">Status Pernikahan:</span>
                              <span className="ml-2 font-medium">{selectedClient.guardianMaritalStatus}</span>
                            </div>
                          )}
                          {selectedClient.guardianLegalCustody !== undefined && (
                            <div className="flex items-center gap-2">
                              <ShieldCheckIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">Hak Asuh Legal:</span>
                              <span className="ml-2 font-medium">{selectedClient.guardianLegalCustody ? 'Ya' : 'Tidak'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Emergency Contact */}
                  {selectedClient.emergencyContactName && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <ExclamationTriangleIcon className="w-4 h-4" />
                          Kontak Darurat
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Nama:</span>
                            <span className="ml-2 font-medium">{selectedClient.emergencyContactName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <UserGroupIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Hubungan:</span>
                            <span className="ml-2 font-medium">{selectedClient.emergencyContactRelationship}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <PhoneIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Telepon:</span>
                            <span className="ml-2 font-medium">{selectedClient.emergencyContactPhone}</span>
                          </div>
                          {selectedClient.emergencyContactAddress && (
                            <div className="md:col-span-2 flex items-start gap-2">
                              <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">Alamat:</span>
                              <span className="ml-2 font-medium">{selectedClient.emergencyContactAddress}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Assigned Therapist Information */}
                  {selectedClient.assignedTherapistName && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <UserCircleIcon className="w-4 h-4" />
                          Informasi Therapist
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Therapist yang Ditugaskan:</span>
                            <span className="ml-2 font-medium">{selectedClient.assignedTherapistName}</span>
                          </div>
                          {selectedClient.assignedDate && (
                            <div className="flex items-center gap-2">
                              <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">Tanggal Penugasan:</span>
                              <span className="ml-2 font-medium">
                                {new Date(selectedClient.assignedDate).toLocaleDateString('id-ID')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Previous Visit Details */}
                  {!selectedClient.firstVisit && selectedClient.previousVisitDetails && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <ClipboardDocumentListIcon className="w-4 h-4" />
                          Riwayat Kunjungan Sebelumnya
                        </h4>
                        <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">
                          {selectedClient.previousVisitDetails}
                        </p>
                      </div>
                    </>
                  )}

                  {/* System Information */}
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <CpuChipIcon className="w-4 h-4" />
                      Informasi Sistem
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <IdentificationIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">ID Klien:</span>
                        <span className="ml-2 font-medium font-mono text-xs">{selectedClient.id}</span>
                      </div>
                      {selectedClient.createdAt && (
                        <div className="flex items-center gap-2">
                          <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Tanggal Dibuat:</span>
                          <span className="ml-2 font-medium">
                            {new Date(selectedClient.createdAt).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      )}
                      {selectedClient.updatedAt && (
                        <div className="flex items-center gap-2">
                          <ClockIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Terakhir Diperbarui:</span>
                          <span className="ml-2 font-medium">
                            {new Date(selectedClient.updatedAt).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

            </TabsContent>

            <TabsContent value="consultation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DocumentTextIcon className="w-5 h-5" />
                    Base Assessment Konsultasi
                  </CardTitle>
                  <CardDescription>
                    Assessment dasar untuk memulai terapi - satu per klien
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {clientConsultation ? (
                      <>
                        {/* Consultation Summary */}
                        <div className="border rounded-lg p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                                  {clientConsultation.formTypes.join(', ')} Assessment
                                </Badge>
                                <span className="text-sm text-gray-700 font-medium flex items-center gap-1">
                                  <CalendarIcon className="w-4 h-4" />
                                  {new Date(clientConsultation.sessionDate).toLocaleDateString('id-ID')}
                                </span>
                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                  <ClockIcon className="w-4 h-4" />
                                  {clientConsultation.sessionDuration} menit
                                </span>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">Base Assessment Summary</h3>
                              <p className="text-gray-700 mb-4">
                                Assessment ini digunakan sebagai dasar untuk semua sesi terapi selanjutnya.
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleEditConsultation}
                              className="flex items-center gap-2 bg-white"
                            >
                              <PencilIcon className="w-4 h-4" />
                              Edit
                            </Button>
                          </div>

                          {/* Key Information Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-lg border border-blue-200">
                              <h6 className="font-medium text-gray-900 text-sm mb-1">Status</h6>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                {clientConsultation.status}
                              </Badge>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-blue-200">
                              <h6 className="font-medium text-gray-900 text-sm mb-1">Tingkat Keparahan</h6>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-orange-600">{clientConsultation.symptomSeverity}</span>
                                <span className="text-sm text-gray-600">/5</span>
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-blue-200">
                              <h6 className="font-medium text-gray-900 text-sm mb-1">Durasi Gejala</h6>
                              <span className="font-medium text-gray-800">{clientConsultation.symptomDuration}</span>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-blue-200">
                              <h6 className="font-medium text-gray-900 text-sm mb-1">Treatment Goals</h6>
                              <span className="font-medium text-gray-800">{clientConsultation.treatmentGoals?.length || 0} goals</span>
                            </div>
                          </div>

                          {/* Primary Concern */}
                          <div className="bg-white p-4 rounded-lg border border-blue-200 mb-4">
                            <h6 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                              <TagIcon className="w-4 h-4 text-red-500" />
                              Keluhan Utama
                            </h6>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {clientConsultation.primaryConcern}
                            </p>
                          </div>

                          {/* AI Script Preferences */}
                          {clientConsultation.scriptGenerationPreferences && (
                            <div className="bg-white p-4 rounded-lg border border-blue-200 mb-4">
                              <h6 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                <CpuChipIcon className="w-4 h-4 text-blue-500" />
                                AI Script Preferences
                              </h6>
                              <p className="text-gray-600 text-sm italic bg-gray-50 p-3 rounded-lg">
                                {clientConsultation.scriptGenerationPreferences}
                              </p>
                            </div>
                          )}

                          {/* Therapist Notes */}
                          {clientConsultation.consultationNotes && (
                            <div className="bg-white p-4 rounded-lg border border-blue-200">
                              <h6 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                <DocumentTextIcon className="w-4 h-4 text-gray-500" />
                                Catatan Terapis
                              </h6>
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {clientConsultation.consultationNotes}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Treatment Plan Summary */}
                        {clientConsultation.recommendedTreatmentPlan && (
                          <div className="border rounded-lg p-6 bg-green-50">
                            <h4 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
                              <LightBulbIcon className="w-5 h-5 text-green-600" />
                              Rencana Terapi
                            </h4>
                            <p className="text-green-800 text-sm leading-relaxed">
                              {clientConsultation.recommendedTreatmentPlan}
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {/* No Consultation - Call to Action */}
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Base Assessment</h3>
                          <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Base assessment diperlukan untuk memulai terapi. Assessment ini akan menjadi dasar untuk semua sesi terapi klien.
                          </p>
                          <div className="flex justify-center items-center w-full">
                            <div className="flex justify-center w-full">
                              <Button
                                onClick={handleStartConsultation}
                                className="flex items-center gap-2 mx-auto"
                                size="lg"
                              >
                                <DocumentTextIcon className="w-5 h-5" />
                                Buat Base Assessment
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Info Card */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-blue-800 mb-2">
                                Tentang Base Assessment
                              </h3>
                              <div className="text-sm text-blue-700 space-y-2">
                                <p>Base assessment adalah fondasi terapi yang berisi:</p>
                                <ul className="list-disc list-inside ml-2 space-y-1">
                                  <li>Analisis mendalam kondisi klien</li>
                                  <li>Riwayat kesehatan mental dan fisik</li>
                                  <li>Tujuan terapi yang ingin dicapai</li>
                                  <li>Preferensi untuk personalisasi AI script</li>
                                  <li>Rencana treatment yang direkomendasikan</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5" />
                    Sesi Terapi
                  </CardTitle>
                  <CardDescription>
                    Kelola sesi terapi dan riwayat treatment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(sessionsLoading || isRefreshing) && activeTab === 'sessions' ? (
                    // Loading state for sessions
                    <div className="flex items-center flex-col justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
                      <div className="text-center">
                        <p className="text-gray-600">Memuat sesi terapi...</p>
                      </div>
                    </div>
                  ) : clientConsultation ? (
                    <div className="space-y-6">
                      {/* Start Session Action */}
                      {(() => {
                        const hasConsultation = !!clientConsultation;

                        return (
                          <div className={`text-center py-8 rounded-lg border ${hasConsultation
                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                            : 'bg-gray-50 border-gray-300'
                            }`}>
                            <HeartIcon className={`w-16 h-16 mx-auto mb-4 ${hasConsultation ? 'text-green-600' : 'text-gray-400'
                              }`} />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {therapySessions.length === 0 ? 'Mulai Sesi Terapi Pertama' : 'Jadwalkan Sesi Terapi Baru'}
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                              {therapySessions.length === 0
                                ? 'Base assessment tersedia. AI akan menganalisis data klien untuk memberikan prediksi masalah dan teknik terapi yang efektif.'
                                : hasConsultation
                                  ? 'Jadwalkan sesi terapi lanjutan berdasarkan progress klien.'
                                  : 'Base assessment diperlukan untuk memulai sesi terapi.'
                              }
                            </p>
                            <div className="flex justify-center">
                              <Button
                                onClick={handleStartTherapySession}
                                disabled={!hasConsultation}
                                className={`flex items-center gap-2 ${hasConsultation
                                  ? 'bg-green-600 hover:bg-green-700'
                                  : ''
                                  }`}
                                size="lg"
                              >
                                <HeartIcon className="w-5 h-5" />
                                {therapySessions.length === 0 ? 'Mulai Sesi Pertama' : 'Jadwalkan Sesi Baru'}
                              </Button>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Session History */}
                      {therapySessions.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Riwayat & Jadwal Sesi Terapi</h4>
                          <div className="space-y-4">
                            {(sessionsLoading || isRefreshing) && activeTab === 'sessions' ? (
                              // Loading state for session list
                              <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                  <div key={i} className="border rounded-lg p-6 animate-pulse">
                                    <div className="flex items-start justify-between mb-4">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                          <div className="h-6 w-16 bg-gray-200 rounded" />
                                          <div className="h-4 w-32 bg-gray-200 rounded" />
                                          <div className="h-4 w-20 bg-gray-200 rounded" />
                                        </div>
                                                                                  <div className="h-5 w-48 bg-gray-200 rounded mb-2" />
                                          <div className="h-4 w-64 bg-gray-200 rounded" />
                                      </div>
                                                                              <div className="ml-6">
                                          <div className="h-6 w-20 bg-gray-200 rounded" />
                                        </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              therapySessions.map((session) => {
                                const isExpanded = expandedSessions.has(session.id);
                                return (
                                  <div key={session.id} className="border rounded-lg hover:bg-gray-50 transition-colors">
                                    {/* Collapsed Header */}
                                    <div
                                      className="p-4 cursor-pointer"
                                      onClick={() => toggleSessionExpansion(session.id)}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          {isExpanded ? (
                                            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                                          ) : (
                                            <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                                          )}
                                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                            #{session.sessionNumber}
                                          </Badge>
                                          <h5 className="font-semibold text-gray-900">{session.title}</h5>
                                          <Badge
                                            variant="outline"
                                            className={`${session.status === TherapySessionStatusEnum.Completed
                                              ? 'bg-green-50 text-green-700 border-green-200'
                                              : session.status === TherapySessionStatusEnum.Scheduled
                                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                : session.status === TherapySessionStatusEnum.Planned
                                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                  : session.status === TherapySessionStatusEnum.Cancelled
                                                    ? 'bg-red-50 text-red-700 border-red-200'
                                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                              }`}
                                          >
                                            {session.status === TherapySessionStatusEnum.Completed ? 'Selesai' :
                                              session.status === TherapySessionStatusEnum.Scheduled ? 'Dijadwalkan' :
                                                session.status === TherapySessionStatusEnum.Planned ? 'Direncanakan' :
                                                  session.status === TherapySessionStatusEnum.Cancelled ? 'Dibatalkan' : 'Berlangsung'}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                      <div className="px-4 pb-4 border-t border-gray-100">
                                        <div className="pt-4 space-y-4">
                                          {/* Session Details */}
                                          <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                              <CalendarIcon className="w-4 h-4" />
                                              {new Date(session.date).toLocaleDateString('id-ID')}
                                            </span>
                                            <span className="flex items-center gap-1">
                                              <ClockIcon className="w-4 h-4" />
                                              {session.time}
                                            </span>
                                            <span className="flex items-center gap-1">
                                              <ClockIcon className="w-4 h-4" />
                                              {session.duration} menit
                                            </span>
                                          </div>

                                          {session.description && (
                                            <div>
                                              <h6 className="font-medium text-gray-900 mb-2">Deskripsi Sesi</h6>
                                              <p className="text-gray-700 text-sm">{session.description}</p>
                                            </div>
                                          )}

                                          {session.techniques && (
                                            <div>
                                              <h6 className="font-medium text-gray-900 mb-2">Teknik Terapi</h6>
                                              <div className="flex flex-wrap gap-2">
                                                {session.techniques.map((technique, index) => (
                                                  <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                    {technique}
                                                  </Badge>
                                                ))}
                                              </div>
                                            </div>
                                          )}

                                          {session.issues && (
                                            <div>
                                              <h6 className="font-medium text-gray-900 mb-2">Fokus Masalah</h6>
                                              <div className="flex flex-wrap gap-2">
                                                {session.issues.map((issue, index) => (
                                                  <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                                    {issue}
                                                  </Badge>
                                                ))}
                                              </div>
                                            </div>
                                          )}

                                          {session.notes && (
                                            <div>
                                              <h6 className="font-medium text-gray-900 mb-2">Catatan</h6>
                                              <div className="p-3 bg-gray-50 rounded-lg">
                                                <span className="text-gray-700 text-sm">{session.notes}</span>
                                              </div>
                                            </div>
                                          )}

                                          {/* Action Buttons - Moved to bottom right */}
                                          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                                            {(session.status === TherapySessionStatusEnum.Scheduled || session.status === TherapySessionStatusEnum.Planned) && (
                                              <>
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => handleEditSession(session.id)}
                                                  className="flex items-center gap-1"
                                                >
                                                  <PencilIcon className="w-3 h-3" />
                                                  Edit
                                                </Button>
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => handleCancelSession(session.id)}
                                                  className="flex items-center gap-1 text-red-600 border-red-300 hover:bg-red-50"
                                                >
                                                  <XMarkIcon className="w-3 h-3" />
                                                  Batal
                                                </Button>
                                                {session.status === TherapySessionStatusEnum.Scheduled && (
                                                  <Button
                                                    size="sm"
                                                    onClick={() => handleStartSessionClick(session.id)}
                                                    disabled={(() => {
                                                      // Check if previous session is not completed
                                                      const previousSessions = therapySessions
                                                        .filter(s => s.sessionNumber < session.sessionNumber)
                                                        .sort((a, b) => b.sessionNumber - a.sessionNumber);

                                                      if (previousSessions.length > 0) {
                                                        const lastSession = previousSessions[0];
                                                        return lastSession && lastSession.status !== TherapySessionStatusEnum.Completed;
                                                      }
                                                      return false;
                                                    })()}
                                                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                  >
                                                    <HeartIcon className="w-3 h-3" />
                                                    Mulai
                                                  </Button>
                                                )}
                                              </>
                                            )}
                                            {session.status === TherapySessionStatusEnum.InProgress && (
                                              <Button
                                                size="sm"
                                                onClick={() => handleContinueSession(session.id)}
                                                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
                                              >
                                                <CheckIcon className="w-3 h-3" />
                                                Lanjutkan
                                              </Button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Base Assessment Diperlukan</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Buat base assessment terlebih dahulu di tab Konsultasi untuk dapat memulai sesi terapi dengan prediksi AI.
                      </p>
                      <div className="flex justify-center items-center w-full">
                        <div className="flex justify-center w-full">
                          <Button disabled className="flex items-center gap-2">
                            <HeartIcon className="w-4 h-4" />
                            Mulai Sesi Terapi
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Consultation Form Modal */}
      <FormModal
        open={showConsultationForm}
        onOpenChange={setShowConsultationForm}
        title={editingConsultation ? "Edit Base Assessment" : "Buat Base Assessment"}
        description={editingConsultation
          ? `Edit assessment dasar untuk ${selectedClient?.fullName || 'klien'}`
          : `Buat assessment dasar untuk ${selectedClient?.fullName || 'klien'}`
        }
        size="5xl"
        showCloseButton={false}
      >
        <ConsultationForm
          form={consultationForm as any} // Type conversion for compatibility
          onSubmit={handleConsultationSubmit}
          isSubmitting={consultationSubmitting}
          isLoading={false}
          mode={editingConsultation ? "edit" : "create"}
          allowTypeChange={!editingConsultation} // Don't allow type change when editing
          client={selectedClient as any} // Type conversion for compatibility
          readOnly={false}
          onCancel={() => setShowConsultationForm(false)}
        />
      </FormModal>

      {/* Session Setup Modal */}
      <FormModal
        open={showSessionSetup}
        onOpenChange={setShowSessionSetup}
        title="Setup Sesi Terapi"
        description={`Setup sesi terapi untuk ${selectedClient?.fullName || 'klien'}`}
        size="6xl"
        showCloseButton={false}
        fitContent={true}
      >
        <div className="space-y-6">
          {generatingPredictions ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <CpuChipIcon className="w-5 h-5 text-blue-600" />
                AI Sedang Menganalisis...
              </h3>
              <p className="text-gray-600">
                Sistem AI menganalisis data konsultasi klien untuk memprediksi masalah dan teknik terapi yang efektif.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Session Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Sesi
                    </label>
                    <Input
                      value={sessionFormData.sessionNumber || Math.max(...therapySessions.map(s => s.sessionNumber), 0) + 1}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Judul Sesi *
                    </label>
                    <Input
                      placeholder="Masukkan judul sesi terapi..."
                      value={sessionFormData.title}
                      onChange={(e) => setSessionFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi Sesi
                    </label>
                    <textarea
                      placeholder="Masukkan deskripsi atau tujuan sesi terapi..."
                      value={sessionFormData.description}
                      onChange={(e) => setSessionFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Sesi {editingSession ? '*' : '(Opsional)'}
                    </label>
                    <Input
                      type="date"
                      value={sessionFormData.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSessionFormData(prev => ({ ...prev, date: e.target.value }))}
                      placeholder={editingSession ? undefined : "Kosongkan untuk sesi yang belum dijadwalkan"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waktu Sesi {editingSession ? '*' : '(Opsional)'}
                    </label>
                    <Input
                      type="time"
                      value={sessionFormData.time}
                      onChange={(e) => setSessionFormData(prev => ({ ...prev, time: e.target.value }))}
                      placeholder={editingSession ? undefined : "Kosongkan untuk sesi yang belum dijadwalkan"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durasi (menit) {editingSession ? '*' : '(Opsional)'}
                    </label>
                    <select
                      value={sessionFormData.duration || ''}
                      onChange={(e) => setSessionFormData(prev => ({ ...prev, duration: e.target.value ? parseInt(e.target.value) : undefined }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Pilih durasi...</option>
                      <option value={60}>60 menit</option>
                      <option value={90}>90 menit</option>
                      <option value={120}>120 menit</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* AI Predictions Section - Only for first session */}
              {aiPredictions && (
                <>
                  <Separator />

                  {/* AI Predictions Results */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                      <SparklesIcon className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Hasil Analisis AI</h3>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                        Berdasarkan Base Assessment
                      </Badge>
                    </div>
                    <p className="text-gray-700 mb-4">
                      AI telah menganalisis data konsultasi dan memberikan prediksi masalah klien serta rekomendasi teknik terapi yang paling efektif.
                    </p>
                    <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">Kapan Prediksi AI Dibuat:</p>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            <li><strong>Sesi Pertama:</strong> Prediksi dibuat berdasarkan base assessment</li>
                            <li><strong>Sesi Lanjutan:</strong> Prediksi akan dibuat saat sesi dimulai berdasarkan progress klien terbaru</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Client Issues Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <TagIcon className="w-5 h-5 text-red-500" />
                        Masalah Klien
                      </h4>
                      <Badge variant="outline" className="text-gray-600">
                        {selectedIssues.length} dipilih
                      </Badge>
                    </div>

                    {/* Selected Issues (Pills) */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-700">Masalah yang Dipilih:</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedIssues.map((issue) => (
                          <div key={issue.id} className="flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-2 rounded-full border border-orange-200">
                            <span className="font-medium">{issue.name}</span>
                            {issue.confidence && (
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300 text-xs">
                                {issue.confidence}%
                              </Badge>
                            )}
                            <button
                              onClick={() => handleRemoveIssue(issue.id)}
                              className="text-orange-600 hover:text-orange-800 p-1"
                            >
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </div>
                        ))}

                        {selectedIssues.length === 0 && (
                          <p className="text-gray-500 italic">Belum ada masalah yang dipilih</p>
                        )}
                      </div>
                    </div>

                    {/* Add Custom Issue */}
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-700">Tambah Masalah Baru (Berdasarkan Observasi Terapis):</h5>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Masukkan masalah yang diamati saat konsultasi..."
                          value={newIssue}
                          onChange={(e) => setNewIssue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddNewIssue()}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleAddNewIssue}
                          disabled={!newIssue.trim()}
                          className="flex items-center gap-2"
                        >
                          <PlusIcon className="w-4 h-4" />
                          Tambah
                        </Button>
                      </div>
                    </div>

                    {/* Predicted Issues */}
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-700">Prediksi AI (Klik untuk Menambahkan):</h5>
                      <div className="flex flex-wrap gap-2">
                        {aiPredictions.issues
                          .filter(issue => !selectedIssues.find(selected => selected.id === issue.id))
                          .map((issue) => (
                            <button
                              key={issue.id}
                              onClick={() => handleAddPredictedIssue(issue as { id: string; name: string; confidence: number })}
                              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-full border border-gray-300 transition-colors"
                            >
                              <span>{issue.name}</span>
                              <Badge variant="outline" className="bg-white text-gray-600 border-gray-300 text-xs">
                                {issue.confidence}%
                              </Badge>
                              <PlusIcon className="w-3 h-3" />
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Therapy Techniques Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <WrenchScrewdriverIcon className="w-5 h-5 text-blue-500" />
                        Teknik Terapi Efektif
                      </h4>
                      <Badge variant="outline" className="text-gray-600">
                        {selectedTechniques.length} dipilih
                      </Badge>
                    </div>

                    {/* Selected Techniques */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-700">Teknik yang Dipilih:</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedTechniques.map((technique) => (
                          <div key={technique.id} className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-full border border-green-200">
                            <span className="font-medium">{technique.name}</span>
                            {technique.effectiveness && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-xs">
                                {technique.effectiveness}%
                              </Badge>
                            )}
                            <button
                              onClick={() => handleRemoveTechnique(technique.id)}
                              className="text-green-600 hover:text-green-800 p-1"
                            >
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </div>
                        ))}

                        {selectedTechniques.length === 0 && (
                          <p className="text-gray-500 italic">Belum ada teknik yang dipilih</p>
                        )}
                      </div>
                    </div>

                    {/* Available Techniques */}
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-700">Rekomendasi AI (Klik untuk Toggle):</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {aiPredictions.techniques.map((technique) => {
                          const isSelected = selectedTechniques.find(selected => selected.id === technique.id);
                          return (
                            <button
                              key={technique.id}
                              onClick={() => handleToggleTechnique(technique as { id: string; name: string; effectiveness: number })}
                              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${isSelected
                                ? 'bg-green-100 border-green-300 text-green-800'
                                : 'bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-800'
                                }`}
                            >
                              <span className="font-medium text-sm">{technique.name}</span>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${isSelected
                                    ? 'bg-green-50 text-green-700 border-green-300'
                                    : 'bg-white text-gray-600 border-gray-300'
                                    }`}
                                >
                                  {technique.effectiveness}%
                                </Badge>
                                {isSelected && <CheckIcon className="w-4 h-4 text-green-600" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowSessionSetup(false)}
                  className="flex items-center gap-2"
                >
                  Batal
                </Button>

                <Button
                  onClick={handleShowSaveConfirmation}
                  disabled={!sessionFormData.title || !sessionFormData.date || !sessionFormData.time || (aiPredictions && (selectedIssues.length === 0 || selectedTechniques.length === 0)) || !aiPredictions || !selectedIssues || !selectedTechniques}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <HeartIcon className="w-4 h-4" />
                  {editingSession ? 'Update Sesi Terapi' : 'Simpan Sesi Terapi'}
                  {aiPredictions && ` (${selectedIssues.length} masalah, ${selectedTechniques.length} teknik)`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </FormModal>

      {/* Cancel Session Modal */}
      <FormModal
        open={showCancelModal}
        onOpenChange={setShowCancelModal}
        title="Batalkan Sesi"
        description="Berikan alasan pembatalan sesi"
        size="md"
        showCloseButton={true}
        fitContent={true}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alasan Pembatalan *
            </label>
            <textarea
              placeholder="Masukkan alasan pembatalan sesi..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowCancelModal(false);
                setCancellingSession(null);
                setCancelReason('');
              }}
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirmCancel}
              disabled={!cancelReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              Konfirmasi Pembatalan
            </Button>
          </div>
        </div>
      </FormModal>

      {/* Continue Session Confirmation Dialog */}
      <FormModal
        open={showContinueDialog}
        onOpenChange={setShowContinueDialog}
        title="Lanjutkan Sesi"
        description="Apakah Anda yakin ingin melanjutkan dan menyelesaikan sesi ini?"
        size="sm"
        showCloseButton={true}
        fitContent={true}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Sesi akan ditandai sebagai selesai dan tidak dapat diubah kembali.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowContinueDialog(false);
                setContinuingSession(null);
              }}
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirmContinue}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Lanjutkan & Selesaikan
            </Button>
          </div>
        </div>
      </FormModal>

      {/* Start Session Confirmation Dialog */}
      <FormModal
        open={showStartConfirmation}
        onOpenChange={setShowStartConfirmation}
        title="Mulai Sesi"
        description="Apakah Anda yakin ingin memulai sesi ini?"
        size="sm"
        showCloseButton={true}
        fitContent={true}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Sesi akan dimulai dan status akan berubah menjadi "Berlangsung".
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowStartConfirmation(false);
                setStartingSession(null);
              }}
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirmStart}
              className="bg-green-600 hover:bg-green-700"
            >
              Mulai Sesi
            </Button>
          </div>
        </div>
      </FormModal>

      {/* Save Session Confirmation Dialog */}
      <FormModal
        open={showSaveConfirmation}
        onOpenChange={setShowSaveConfirmation}
        title={editingSession ? "Update Sesi Terapi" : "Simpan Sesi Terapi"}
        description={`Apakah Anda yakin ingin ${editingSession ? 'memperbarui' : 'menyimpan'} sesi terapi ini?`}
        size="md"
        showCloseButton={true}
        fitContent={true}
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <InformationCircleIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Detail Sesi Terapi:
                </h4>
                <div className="text-sm text-blue-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Judul:</span>
                    <span>{sessionFormData.title}</span>
                  </div>
                  {sessionFormData.description && (
                    <div className="flex justify-between">
                      <span className="font-medium">Deskripsi:</span>
                      <span className="text-xs">{sessionFormData.description}</span>
                    </div>
                  )}
                  {sessionFormData.date && (
                    <div className="flex justify-between">
                      <span className="font-medium">Tanggal:</span>
                      <span>{new Date(sessionFormData.date).toLocaleDateString('id-ID')}</span>
                    </div>
                  )}
                  {sessionFormData.time && (
                    <div className="flex justify-between">
                      <span className="font-medium">Waktu:</span>
                      <span>{sessionFormData.time}</span>
                    </div>
                  )}
                  {sessionFormData.duration && (
                    <div className="flex justify-between">
                      <span className="font-medium">Durasi:</span>
                      <span>{sessionFormData.duration} menit</span>
                    </div>
                  )}
                  {!editingSession && aiPredictions && (
                    <>
                      <div className="flex justify-between">
                        <span className="font-medium">Masalah:</span>
                        <span>{selectedIssues.length} dipilih</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Teknik:</span>
                        <span>{selectedTechniques.length} dipilih</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSaveConfirmation(false)}
              disabled={savingSession}
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirmSave}
              disabled={savingSession}
              className="bg-green-600 hover:bg-green-700"
            >
              {savingSession ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  {editingSession ? 'Memperbarui...' : 'Menyimpan...'}
                </div>
              ) : (
                editingSession ? 'Update Sesi' : 'Simpan Sesi'
              )}
            </Button>
          </div>
        </div>
      </FormModal>
    </PageWrapper>
  );
}