// src/modules/auth/types.ts

export type UserRole = 'APPLICANT' | 'VOLUNTEER' | 'COORDINATOR';

export interface IUser {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  email?: string;
  avatarUrl?: string;
  rating?: number;
  completedTasksCount?: number;
}
