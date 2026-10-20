// src/modules/notifications/types.ts
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface INotification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}
