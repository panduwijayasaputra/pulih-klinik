'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  getClinicProfile,
  updateClinicProfile,
  getClinicDocuments,
  uploadClinicDocument,
  deleteClinicDocument,
  downloadClinicDocument,
  ClinicApiError,
} from '@/lib/api/clinic';

import {
  ClinicProfile,
  ClinicProfileFormData,
  ClinicDocument,
} from '@/types/clinic';

interface ClinicStoreState {
  profile: ClinicProfile | null;
  documents: ClinicDocument[];

  isLoadingProfile: boolean;
  isLoadingDocuments: boolean;
  isUpdatingProfile: boolean;
  isUploadingDocument: boolean;

  error: string | null;

  // Actions
  loadProfile: () => Promise<void>;
  updateProfile: (data: ClinicProfileFormData) => Promise<void>;
  loadDocuments: () => Promise<void>;
  uploadDocument: (
    file: File,
    type: ClinicDocument['type'],
    description?: string
  ) => Promise<ClinicDocument | null>;
  deleteDocumentById: (documentId: string) => Promise<void>;
  downloadDocumentById: (documentId: string, fileName: string) => Promise<void>;

  clearError: () => void;
  resetClinic: () => void;
}

export const useClinicStore = create<ClinicStoreState>()(
  persist(
    (set, get) => ({
      profile: null,
      documents: [],

      isLoadingProfile: false,
      isLoadingDocuments: false,
      isUpdatingProfile: false,
      isUploadingDocument: false,

      error: null,

      clearError: () => set({ error: null }),

      resetClinic: () =>
        set({
          profile: null,
          documents: [],
          isLoadingProfile: false,
          isLoadingDocuments: false,
          isUpdatingProfile: false,
          isUploadingDocument: false,
          error: null,
        }),

      loadProfile: async () => {
        set({ isLoadingProfile: true, error: null });
        try {
          const profile = await getClinicProfile();
          set({ profile });
        } catch (err) {
          const message = err instanceof ClinicApiError ? err.message : 'Gagal memuat profil klinik';
          set({ error: message });
        } finally {
          set({ isLoadingProfile: false });
        }
      },

      updateProfile: async (data: ClinicProfileFormData) => {
        set({ isUpdatingProfile: true, error: null });
        try {
          const updated = await updateClinicProfile(data);
          set({ profile: updated });
        } catch (err) {
          const message = err instanceof ClinicApiError ? err.message : 'Gagal memperbarui profil klinik';
          set({ error: message });
          throw err;
        } finally {
          set({ isUpdatingProfile: false });
        }
      },

      loadDocuments: async () => {
        set({ isLoadingDocuments: true, error: null });
        try {
          const docs = await getClinicDocuments();
          set({ documents: docs });
        } catch (err) {
          const message = err instanceof ClinicApiError ? err.message : 'Gagal memuat dokumen klinik';
          set({ error: message });
        } finally {
          set({ isLoadingDocuments: false });
        }
      },

      uploadDocument: async (file: File, type: ClinicDocument['type'], description?: string) => {
        set({ isUploadingDocument: true, error: null });
        try {
          const doc = await uploadClinicDocument(file, type, description);
          // Prepend newly uploaded document
          const current = get().documents;
          set({ documents: [doc, ...current] });
          return doc;
        } catch (err) {
          const message = err instanceof ClinicApiError ? err.message : 'Gagal mengunggah dokumen';
          set({ error: message });
          return null;
        } finally {
          set({ isUploadingDocument: false });
        }
      },

      deleteDocumentById: async (documentId: string) => {
        set({ error: null });
        try {
          await deleteClinicDocument(documentId);
          const remaining = get().documents.filter((d) => d.id !== documentId);
          set({ documents: remaining });
        } catch (err) {
          const message = err instanceof ClinicApiError ? err.message : 'Gagal menghapus dokumen';
          set({ error: message });
          throw err;
        }
      },

      downloadDocumentById: async (documentId: string, fileName: string) => {
        set({ error: null });
        try {
          await downloadClinicDocument(documentId, fileName);
        } catch (err) {
          const message = err instanceof ClinicApiError ? err.message : 'Gagal mengunduh dokumen';
          set({ error: message });
          throw err;
        }
      },
    }),
    {
      name: 'clinic-store',
      partialize: (state) => ({
        profile: state.profile,
        documents: state.documents,
      }),
    }
  )
);


