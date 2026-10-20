// src/modules/requests/components/StatusBadge/StatusBadge.tsx
'use client';

import React from 'react';
import { RequestStatus } from '../../types';
import styles from './StatusBadge.module.scss';

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; icon: React.ReactNode; styleKey: string }
> = {
  PENDING: {
    label: 'Ищет волонтёра',
    styleKey: 'pending',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  ASSIGNED: {
    label: 'Волонтёр назначен',
    styleKey: 'assigned',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7.5" r="4" />
        <polyline points="17 11 19 13 23 9" />
      </svg>
    ),
  },
  IN_PROGRESS: {
    label: 'В процессе',
    styleKey: 'in_progress',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </svg>
    ),
  },
  COMPLETED: {
    label: 'Завершена',
    styleKey: 'completed',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  CANCELLED: {
    label: 'Отменена',
    styleKey: 'cancelled',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;

  return (
    <span
      className={`${styles.badge} ${styles[cfg.styleKey]} ${className || ''}`}
      role="status"
      aria-label={`Статус заявки: ${cfg.label}`}
    >
      <span className={styles.icon}>{cfg.icon}</span>
      <span>{cfg.label}</span>
    </span>
  );
}
