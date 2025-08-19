// Consultation Form Options Constants
// This file contains all possible selection options for consultation forms

export const SYMPTOM_DURATION_OPTIONS = [
  { value: '<1 month', label: 'Kurang dari 1 bulan' },
  { value: '1-3 months', label: '1-3 bulan' },
  { value: '3-6 months', label: '3-6 bulan' },
  { value: '>6 months', label: 'Lebih dari 6 bulan' },
] as const;

export const PROBLEM_FREQUENCY_OPTIONS = [
  { value: 'Daily', label: 'Harian' },
  { value: 'Weekly', label: 'Mingguan' },
  { value: 'Monthly', label: 'Bulanan' },
  { value: 'Rare', label: 'Jarang' },
] as const;

export const SYMPTOM_SEVERITY_OPTIONS = [
  { value: 1, label: 'Tidak mengganggu' },
  { value: 2, label: 'Sedikit mengganggu' },
  { value: 3, label: 'Cukup mengganggu' },
  { value: 4, label: 'Sangat mengganggu' },
  { value: 5, label: 'Sangat sangat mengganggu' },
] as const;

export const EMOTION_SCALE_OPTIONS = [
  { label: 'Senang', key: 'happiness' },
  { label: 'Sedih', key: 'sadness' },
  { label: 'Marah', key: 'anger' },
  { label: 'Takut', key: 'fear' },
  { label: 'Cemas', key: 'anxiety' },
  { label: 'Khawatir', key: 'worry' },
  { label: 'Stress', key: 'stress' },
  { label: 'Depresi', key: 'depression' },
  { label: 'Frustasi', key: 'frustration' },
  { label: 'Kecewa', key: 'disappointment' },
  { label: 'Bersalah', key: 'guilt' },
  { label: 'Malu', key: 'shame' },
  { label: 'Iri', key: 'envy' },
  { label: 'Cemburu', key: 'jealousy' },
  { label: 'Benci', key: 'hatred' },
  { label: 'Kesepian', key: 'loneliness' },
  { label: 'Tenang', key: 'calmness' },
  { label: 'Percaya Diri', key: 'confidence' },
  { label: 'Optimis', key: 'optimism' },
  { label: 'Putus Asa', key: 'despair' },
] as const;

export const SLEEP_QUALITY_OPTIONS = [
  { value: 'Good', label: 'Baik' },
  { value: 'Fair', label: 'Lumayan' },
  { value: 'Poor', label: 'Buruk' },
  { value: 'Disturbed', label: 'Terganggu' },
] as const;

export const SELF_HARM_FREQUENCY_OPTIONS = [
  { value: 'Never', label: 'Tidak pernah' },
  { value: 'Sometimes', label: 'Kadang-kadang' },
  { value: 'Often', label: 'Sering' },
] as const;

export const SUBSTANCE_OPTIONS = [
  { label: 'Alkohol', key: 'alcohol' },
  { label: 'Ganja', key: 'marijuana' },
  { label: 'Shabu-shabu', key: 'methamphetamine' },
  { label: 'Kokain', key: 'cocaine' },
  { label: 'Heroin', key: 'heroin' },
  { label: 'Ekstasi', key: 'ecstasy' },
  { label: 'Inhalansia', key: 'inhalants' },
  { label: 'Obat resep (disalahgunakan)', key: 'prescription_drugs' },
  { label: 'Lainnya', key: 'other_substances' },
] as const;

export const PRIMARY_SUBSTANCE_OPTIONS = [
  { value: 'alcohol', label: 'Alkohol' },
  { value: 'marijuana', label: 'Ganja' },
  { value: 'methamphetamine', label: 'Shabu-shabu' },
  { value: 'cocaine', label: 'Kokain' },
  { value: 'heroin', label: 'Heroin' },
  { value: 'ecstasy', label: 'Ekstasi' },
  { value: 'inhalants', label: 'Inhalansia' },
  { value: 'prescription_drugs', label: 'Obat Resep' },
  { value: 'other', label: 'Lainnya' },
] as const;

export const TOLERANCE_LEVEL_OPTIONS = [
  { value: 1, label: 'Sangat rendah' },
  { value: 2, label: 'Rendah' },
  { value: 3, label: 'Sedang' },
  { value: 4, label: 'Tinggi' },
  { value: 5, label: 'Sangat tinggi' },
] as const;

export const DESIRE_TO_QUIT_OPTIONS = [
  { value: 'Yes', label: 'Ya, sangat ingin berhenti' },
  { value: 'Yes, but unsure', label: 'Ya, tapi masih ragu' },
  { value: 'No', label: 'Belum yakin ingin berhenti' },
] as const;

export const CONSULTATION_REASON_OPTIONS = [
  { label: 'Kesulitan belajar', key: 'learning_difficulties' },
  { label: 'Masalah emosi (cemas, sedih, marah berlebihan, dll.)', key: 'emotional_problems' },
  { label: 'Masalah sosial (kesulitan bergaul, bullying, dll.)', key: 'social_problems' },
  { label: 'Gangguan perilaku (agresif, tidak patuh, dll.)', key: 'behavioral_problems' },
  { label: 'Trauma atau pengalaman buruk', key: 'trauma' },
  { label: 'Gangguan tidur/makan', key: 'sleep_eating_disorders' },
] as const;

export const ACADEMIC_PERFORMANCE_OPTIONS = [
  { value: 5, label: 'Sangat baik' },
  { value: 4, label: 'Baik' },
  { value: 3, label: 'Cukup' },
  { value: 2, label: 'Kurang' },
  { value: 1, label: 'Sangat kurang' },
] as const;

export const THERAPY_PREFERENCE_OPTIONS = [
  { value: 'CBT', label: 'Cognitive Behavioral Therapy (CBT)' },
  { value: 'General counseling', label: 'Konseling Umum' },
  { value: 'Undecided', label: 'Belum yakin' },
] as const;
