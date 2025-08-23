export interface Profile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
}
