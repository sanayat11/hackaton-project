// src/modules/requests/components/VolunteerApplyModal/VolunteerApplyModal.tsx
'use client';

import React, { useState } from 'react';
import { IRequest, ApplyRequestDTO } from '../../types';
import { Modal } from '@/shared/components/Modal/Modal';
import { Button } from '@/shared/components/Button/Button';
import { Textarea } from '@/shared/components/Textarea/Textarea';
import { useAuth } from '@/modules/auth/authContext';
import styles from './VolunteerApplyModal.module.scss';

interface VolunteerApplyModalProps {
  request: IRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dto: ApplyRequestDTO) => Promise<void>;
}

export function VolunteerApplyModal({
  request,
  isOpen,
  onClose,
  onConfirm,
}: VolunteerApplyModalProps) {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!request) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;

    setIsSubmitting(true);
    try {
      await onConfirm({
        volunteerId: currentUser.id,
        volunteerName: currentUser.name,
        volunteerPhone: currentUser.phone,
        message: message.trim() || undefined,
      });
      setMessage('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Отклик волонтёра на заявку"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Отмена
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={!agreed}
          >
            Подтвердить отклик
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className={styles.summaryBox}>
          <h4 className={styles.requestTitle}>{request.title}</h4>
          <p className={styles.requestAddress}>
            📍 {request.address} ({request.district})
          </p>
        </div>

        <div className={styles.volunteerInfo}>
          <p>
            Отклик подаётся от имени: <strong>{currentUser.name}</strong>
          </p>
          <p>
            Контактный телефон: <strong>{currentUser.phone}</strong>
          </p>
        </div>

        <Textarea
          label="Комментарий заявителю (необязательно)"
          placeholder="Например: Смогу подъехать к 14:00, машина наготове..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={300}
          currentLength={message.length}
          showCharCount
        />

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            required
          />
          <span>
            Я подтверждаю готовность оказать помощь ответственно и связаться с заявителем.
          </span>
        </label>
      </form>
    </Modal>
  );
}
