'use client';

import React, { useCallback, useEffect, useMemo } from 'react';

import PageTabs from '@/components/ui/page-tabs';
import { ConsultationForm } from '@/components/consultation/ConsultationForm';
import { ConsultationSummary } from '@/components/consultation/ConsultationSummary';
import { Client } from '@/types/client';
import { useAuth } from '@/hooks/useAuth';
import { useConsultation } from '@/store/consultation';
import { useConsultationForm } from '@/hooks/useConsultation';
import { useToast } from '@/components/ui/toast';


import {
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { ConsultationFormTypeEnum } from '@/types/enums';

export interface TherapyPageProps {
  client: Client;
}

export const TherapyPage: React.FC<TherapyPageProps> = ({
  client,
}) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { getConsultationsByClient, loadConsultations } = useConsultation();
  const [activeTab, setActiveTab] = React.useState('summary');
  const [isEditingConsultation, setIsEditingConsultation] = React.useState(false);

  // Get the single consultation for this client (1 client = 1 consultation)
  const clientConsultation = useMemo(() => {
    const consultations = getConsultationsByClient(client.id);
    return consultations.length > 0 ? consultations[0] : null;
  }, [getConsultationsByClient, client.id]);



  // Load consultations when component mounts
  useEffect(() => {
    if (client.id) {
      loadConsultations(client.id, true); // Force reload to ensure fresh data
    }
  }, [client.id, loadConsultations]);





  // Initialize consultation form
  const {
    form,
    handleSubmit,
    handleSave,
    isSubmitting,
    isLoading,
  } = useConsultationForm(ConsultationFormTypeEnum.General, clientConsultation || undefined);

  // Set form values when component mounts or consultation changes
  useEffect(() => {
    if (!clientConsultation && user) {
      // Set default values for new consultation
      form.setValue('clientId', client.id);
      form.setValue('therapistId', user.id);
      form.setValue('sessionDate', new Date().toISOString().slice(0, 16));
    }
  }, [clientConsultation, form, client.id, user]);

  // Handle edit consultation
  const handleEditConsultation = useCallback(() => {
    setIsEditingConsultation(true);
  }, []);

  // Handle cancel edit
  const handleCancelEdit = useCallback(() => {
    setIsEditingConsultation(false);
  }, []);

  // Wrapper functions for form handling
  const handleFormSubmit = useCallback(async (data: any) => {
    try {
      await handleSubmit(data);
      addToast({
        type: 'success',
        title: 'Berhasil',
        message: clientConsultation ? 'Konsultasi berhasil diperbarui' : 'Konsultasi berhasil dibuat'
      });
      // Exit edit mode after successful submission
      setIsEditingConsultation(false);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }, [handleSubmit, clientConsultation, addToast]);

  const handleFormSave = useCallback(async (status?: any) => {
    try {
      await handleSave(status);
      addToast({
        type: 'success',
        title: 'Berhasil',
        message: 'Konsultasi berhasil disimpan'
      });
    } catch (error) {
      console.error('Form save error:', error);
    }
  }, [handleSave, addToast]);


  return (
    <div className="flex justify-center">
      <PageTabs
        tabs={[
          {
            value: 'summary',
            label: 'Ringkasan',
            icon: ChartBarIcon,
            content: <div>Summary content will be added here</div>,
          },
          {
            value: 'consultation',
            label: 'Konsultasi',
            icon: ChatBubbleLeftRightIcon,
            content: (
              <div className="space-y-6">
                {/* Show consultation summary if exists and not editing, otherwise show form */}
                {clientConsultation && !isEditingConsultation ? (
                  <ConsultationSummary
                    consultation={clientConsultation}
                    client={client}
                    onEdit={handleEditConsultation}
                  />
                ) : (
                  <ConsultationForm
                    form={form as any}
                    onSubmit={handleFormSubmit}
                    onSave={handleFormSave}
                    isSubmitting={isSubmitting}
                    isLoading={isLoading}
                    mode={clientConsultation ? 'edit' : 'create'}
                    allowTypeChange={!clientConsultation}
                    client={client}
                    readOnly={false}
                    {...(clientConsultation && { onCancel: handleCancelEdit })}
                  />
                )}
              </div>
            ),
          },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        gridCols={2}
      />
    </div>
  );
};

export default TherapyPage;