// src/modules/auth/authContext.tsx
'use client';

import React, { createContext, useContext, useSyncExternalStore } from 'react';
import { IUser, UserRole } from './types';

export const DEMO_USERS: Record<UserRole, IUser> = {
  APPLICANT: {
    id: 'user-app-1',
    name: 'Айгуль Садыкова',
    role: 'APPLICANT',
    phone: '+996 (555) 12-34-56',
    email: 'aigul.sadykova@example.kg',
  },
  VOLUNTEER: {
    id: 'vol-beka-1',
    name: 'Бектур Асанов',
    role: 'VOLUNTEER',
    phone: '+996 (700) 88-99-00',
    email: 'bektur.asanov@example.kg',
    rating: 4.9,
    completedTasksCount: 14,
  },
  COORDINATOR: {
    id: 'coord-elena-1',
    name: 'Чынгыз Маматов',
    role: 'COORDINATOR',
    phone: '+996 (772) 33-44-55',
    email: 'chyngyz.coord@jocare.kg',
  },
};

interface AuthContextValue {
  currentUser: IUser;
  switchRole: (role: UserRole) => void;
  isVolunteer: boolean;
  isCoordinator: boolean;
  isApplicant: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'joldosh_current_role';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener('joldosh_role_change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('joldosh_role_change', callback);
  };
}

function getSnapshot(): UserRole {
  try {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as UserRole | null;
      if (saved && (saved === 'APPLICANT' || saved === 'VOLUNTEER' || saved === 'COORDINATOR')) {
        return saved;
      }
    }
  } catch {
    // Ignore sandbox errors
  }
  return 'APPLICANT';
}

function getServerSnapshot(): UserRole {
  return 'APPLICANT';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const currentRole = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const switchRole = (role: UserRole) => {
    try {
      localStorage.setItem(STORAGE_KEY, role);
      window.dispatchEvent(new Event('joldosh_role_change'));
    } catch {
      // Ignore
    }
  };

  const currentUser = DEMO_USERS[currentRole];

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchRole,
        isApplicant: currentRole === 'APPLICANT',
        isVolunteer: currentRole === 'VOLUNTEER',
        isCoordinator: currentRole === 'COORDINATOR',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
