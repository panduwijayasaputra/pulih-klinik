import { z } from 'zod';

// Phone validation pattern for Indonesian numbers
const phonePattern = /^(?:\+62|62|0)8[1-9][0-9]{6,10}$/;

export const profileSchema = z.object({
  name: z.string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .regex(/^[a-zA-Z\s]+$/, 'Nama hanya boleh berisi huruf dan spasi'),
  
  email: z.string()
    .email('Format email tidak valid')
    .min(1, 'Email harus diisi'),
  
  phone: z.string().optional().or(z.literal('')),
  
  address: z.string().optional().or(z.literal('')),
  
  bio: z.string().optional().or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
