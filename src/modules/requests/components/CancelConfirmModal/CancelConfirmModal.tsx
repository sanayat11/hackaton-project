// src/modules/requests/components/CancelConfirmModal/CancelConfirmModal.tsx
'use client';

import React, { useState } from 'react';
import { IRequest, CancelRequestDTO } from '../../types';
import { Modal } from '@/shared/components/Modal/Modal';
import { Button } from '@/shared/components/Button/Button';
import { Select } from '@/shared/components/Select/Select';
import { Textarea } from '@/shared/components/Textarea/Textarea';
import styles from './CancelConfirmModal.module.scss';

interface CancelConfirmModalProps {
  request: IRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dto: CancelRequestDTO) => Promise<void>;
}

const COMMON_REASONS = [
  { value: 'Помощь больше не требуется', label: 'Помощь больше не требуется (решено самостоятельно)' },
  { value: 'Изменились обстоятельства / адрес', label: 'Изменились обстоятельства / время / адрес' },
  { value: 'Создана ошибочно или дубликат', label: 'Создана ошибочно или дубликат' },
  { value: 'Другая причина', label: 'Другая причина (указать вручную)' },
];

export function CancelConfirmModal({
  request,
  isOpen,
  onClose,
  onConfirm,
}: CancelConfirmModalProps) {
  const [selectedReason, setSelectedReason] = useState(COMMON_REASONS[0].value);
  const [customReason, setCustomReason] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!request) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = selectedReason === 'Другая причина' ? customReason.trim() : selectedReason;

    if (!finalReason) {
      setError('Пожалуйста, укажите причину отмены заявки');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await onConfirm({ reason: finalReason });
      setCustomReason('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Подтверждение отмены заявки"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Назад
          </Button>
          <Button
            variant="danger"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Подтвердить отмену
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className={styles.warningBox} role="alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <strong>Внимание:</strong> После отмены заявка перестанет отображаться в активной ленте волонтёров.
          </div>
        </div>

        <p className={styles.requestTitle}>Заявка: «{request.title}»</p>

        <div className={styles.reasonGroup}>
          <Select
            label="Причина отмены"
            required
            options={COMMON_REASONS}
            value={selectedReason}
            onChange={(e) => {
              setSelectedReason(e.target.value);
              setError('');
            }}
          />
        </div>

        {selectedReason === 'Другая причина' && (
          <Textarea
            label="Опишите причину подробно"
            required
            placeholder="Укажите, почему отменяется заявка..."
            value={customReason}
            onChange={(e) => {
              setCustomReason(e.target.value);
              if (error) setError('');
            }}
            error={error}
            maxLength={200}
            currentLength={customReason.length}
            showCharCount
          />
        )}
      </form>
    </Modal>
  );
}
