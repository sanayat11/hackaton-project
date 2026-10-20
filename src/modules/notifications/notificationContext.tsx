// src/modules/notifications/notificationContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { INotification, NotificationType } from './types';

interface NotificationContextValue {
  notifications: INotification[];
  notify: (type: NotificationType, title: string, message?: string, duration?: number) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback(
    (type: NotificationType, title: string, message?: string, duration = 4500) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newNotification: INotification = { id, type, title, message, duration };

      setNotifications((prev) => [...prev, newNotification]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  const success = useCallback(
    (title: string, message?: string) => notify('success', title, message),
    [notify]
  );
  const error = useCallback(
    (title: string, message?: string) => notify('error', title, message, 6000),
    [notify]
  );
  const info = useCallback(
    (title: string, message?: string) => notify('info', title, message),
    [notify]
  );
  const warning = useCallback(
    (title: string, message?: string) => notify('warning', title, message, 5000),
    [notify]
  );

  return (
    <NotificationContext.Provider
      value={{ notifications, notify, success, error, info, warning, dismiss }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
