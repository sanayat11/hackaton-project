// src/modules/requests/components/AssignVolunteerModal/AssignVolunteerModal.tsx
'use client';

import React, { useState } from 'react';
import { IRequest, AssignRequestDTO } from '../../types';
import { Modal } from '@/shared/components/Modal/Modal';
import { Button } from '@/shared/components/Button/Button';
import { Select } from '@/shared/components/Select/Select';

interface AssignVolunteerModalProps {
  request: IRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onAssign: (dto: AssignRequestDTO) => Promise<void>;
}

const AVAILABLE_VOLUNTEERS = [
  { id: 'vol-beka-1', name: 'Бектур Асанов', phone: '+996 (700) 88-99-00', district: 'Октябрьский район' },
  { id: 'vol-2', name: 'Алина Муратова', phone: '+996 (709) 33-22-11', district: 'Первомайский район' },
  { id: 'vol-3', name: 'Данияр Исаков (Автоволонтёр)', phone: '+996 (555) 44-77-22', district: 'Ленинский район' },
  { id: 'vol-4', name: 'Айпери Жумалиева (Медик)', phone: '+996 (770) 55-66-88', district: 'Свердловский район' },
];

export function AssignVolunteerModal({
  request,
  isOpen,
  onClose,
  onAssign,
}: AssignVolunteerModalProps) {
  const [selectedVolunteerId, setSelectedVolunteerId] = useState(AVAILABLE_VOLUNTEERS[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!request) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const volunteer = AVAILABLE_VOLUNTEERS.find((v) => v.id === selectedVolunteerId);
    if (!volunteer) return;

    setIsSubmitting(true);
    try {
      await onAssign({
        volunteerId: volunteer.id,
        volunteerName: volunteer.name,
        volunteerPhone: volunteer.phone,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const volunteerOptions = AVAILABLE_VOLUNTEERS.map((v) => ({
    value: v.id,
    label: `${v.name} (${v.district}, тел: ${v.phone})`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Назначение волонтёра координатором"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Отмена
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Назначить
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>
            Заявка: <strong>{request.title}</strong>
          </p>
          <p style={{ fontSize: '0.85rem', color: '#536A5F' }}>
            Локация: {request.address} ({request.district})
          </p>
        </div>

        <Select
          label="Выберите волонтёра для назначения"
          options={volunteerOptions}
          value={selectedVolunteerId}
          onChange={(e) => setSelectedVolunteerId(e.target.value)}
          required
        />
      </form>
    </Modal>
  );
}
