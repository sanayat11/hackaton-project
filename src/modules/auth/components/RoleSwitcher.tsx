// src/modules/auth/components/RoleSwitcher.tsx
'use client';

import React from 'react';
import { useAuth } from '../authContext';
import { UserRole } from '../types';
import styles from './RoleSwitcher.module.scss';
import { useNotification } from '@/modules/notifications/notificationContext';

const ROLES: { id: UserRole; label: string }[] = [
  { id: 'APPLICANT', label: 'Заявитель' },
  { id: 'VOLUNTEER', label: 'Волонтёр' },
  { id: 'COORDINATOR', label: 'Координатор' },
];

export function RoleSwitcher() {
  const { currentUser, switchRole } = useAuth();
  const { info } = useNotification();

  const handleSwitch = (role: UserRole, label: string) => {
    if (currentUser.role === role) return;
    switchRole(role);
    info(`Роль изменена: ${label}`, `Интерфейс настроен для роли «${label}»`);
  };

  return (
    <div
      className={styles.switcherContainer}
      role="radiogroup"
      aria-label="Переключение роли для демонстрации интерфейса"
    >
      {ROLES.map((r) => {
        const isActive = currentUser.role === r.id;
        return (
          <button
            key={r.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            className={`${styles.roleBtn} ${isActive ? styles.active : ''}`}
            onClick={() => handleSwitch(r.id, r.label)}
            title={`Переключить режим интерфейса на «${r.label}»`}
            suppressHydrationWarning
          >
            <span>{r.label}</span>
          </button>
        );
      })}
    </div>
  );
}
