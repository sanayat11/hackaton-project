// src/modules/requests/components/CompleteConfirmModal/CompleteConfirmModal.tsx
'use client';

import React, { useState } from 'react';
import { IRequest, CompleteRequestDTO } from '../../types';
import { Modal } from '@/shared/components/Modal/Modal';
import { Button } from '@/shared/components/Button/Button';
import { Textarea } from '@/shared/components/Textarea/Textarea';
import styles from './CompleteConfirmModal.module.scss';

interface CompleteConfirmModalProps {
  request: IRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dto: CompleteRequestDTO) => Promise<void>;
}

export function CompleteConfirmModal({
  request,
  isOpen,
  onClose,
  onConfirm,
}: CompleteConfirmModalProps) {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!request) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirm({
        completionNotes: notes.trim() || undefined,
      });
      setNotes('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Подтверждение завершения помощи"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Отмена
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            leftIcon={<span>✓</span>}
          >
            Завершить заявку
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className={styles.successIntro}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <div>
            Спасибо за проделанную работу! Фиксация завершения заявки поможет вести учёт добрых дел и обновить статус для заявителя.
          </div>
        </div>

        <p className={styles.requestTitle}>Заявка: «{request.title}»</p>

        <Textarea
          label="Краткий отчёт или комментарий (необязательно)"
          placeholder="Например: Продукты закуплены по списку и доставлены, чек передан..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={300}
          currentLength={notes.length}
          showCharCount
        />
      </form>
    </Modal>
  );
}
