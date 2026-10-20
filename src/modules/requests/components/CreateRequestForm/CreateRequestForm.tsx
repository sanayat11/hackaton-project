// src/modules/requests/components/CreateRequestForm/CreateRequestForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateRequestDTO, RequestCategory, UrgencyLevel } from '../../types';
import { CATEGORIES_CONFIG, DISTRICTS, URGENCY_CONFIG } from '../../constants';
import { requestService } from '../../api/requestService';
import { useAuth } from '@/modules/auth/authContext';
import { useNotification } from '@/modules/notifications/notificationContext';
import { Input } from '@/shared/components/Input/Input';
import { Textarea } from '@/shared/components/Textarea/Textarea';
import { Select } from '@/shared/components/Select/Select';
import { Button } from '@/shared/components/Button/Button';
import {
  validateRequired,
  validateMinLength,
  validatePhone,
  formatKyrgyzPhone,
} from '@/shared/lib/validation';
import styles from './CreateRequestForm.module.scss';

export function CreateRequestForm() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { success, error } = useNotification();

  const [formData, setFormData] = useState<CreateRequestDTO>({
    title: '',
    category: 'delivery',
    urgency: 'medium',
    description: '',
    address: '',
    district: DISTRICTS[0],
    contactName: currentUser.name || '',
    contactPhone: currentUser.phone || '',
    preferredTime: 'Сегодня во второй половине дня',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateRequestDTO, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateRequestDTO, string>> = {};

    if (!validateRequired(formData.title)) {
      newErrors.title = 'Введите краткую суть обращения';
    } else if (!validateMinLength(formData.title, 5)) {
      newErrors.title = 'Название должно содержать минимум 5 символов';
    }

    if (!validateRequired(formData.description)) {
      newErrors.description = 'Опишите подробно, какое требуется сопровождение или помощь';
    } else if (!validateMinLength(formData.description, 15)) {
      newErrors.description = 'Описание должно содержать минимум 15 символов';
    }

    if (!validateRequired(formData.address)) {
      newErrors.address = 'Укажите точный адрес (улица, номер дома/квартиры)';
    } else if (!validateMinLength(formData.address, 5)) {
      newErrors.address = 'Адрес слишком короткий';
    }

    if (!validateRequired(formData.contactName)) {
      newErrors.contactName = 'Укажите имя заявителя или опекуна';
    }

    if (!validateRequired(formData.contactPhone)) {
      newErrors.contactPhone = 'Укажите контактный номер телефона';
    } else if (!validatePhone(formData.contactPhone)) {
      newErrors.contactPhone = 'Введите корректный номер Кыргызстана (+996 XXX XX-XX-XX)';
    }

    if (!validateRequired(formData.preferredTime)) {
      newErrors.preferredTime = 'Укажите желаемое время встречи волонтёра';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatKyrgyzPhone(e.target.value);
    setFormData((prev) => ({ ...prev, contactPhone: formatted }));
    if (errors.contactPhone) {
      setErrors((prev) => ({ ...prev, contactPhone: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      error('Форма содержит ошибки', 'Пожалуйста, проверьте выделенные поля перед отправкой');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await requestService.createRequest(formData, currentUser.id);
      success(
        'Заявка зарегистрирована',
        `Заявка «${created.title}» опубликована и доступна волонтёрам города.`
      );
      router.push(`/requests/${created.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Не удалось зарегистрировать заявку';
      error('Ошибка регистрации', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = (Object.keys(CATEGORIES_CONFIG) as RequestCategory[]).map((cat) => ({
    value: cat,
    label: CATEGORIES_CONFIG[cat].label,
  }));

  const districtOptions = DISTRICTS.map((d) => ({
    value: d,
    label: d,
  }));

  return (
    <div className={styles.formCard}>
      <header className={styles.formHeader}>
        <div className={styles.serviceRef}>ЖОЛДОШ • ФОРМУЛЯР ЗАЯВИТЕЛЯ</div>
        <h1 className={styles.title}>Регистрация заявки на сопровождение</h1>
        <p className={styles.subtitle}>
          Опишите, какая помощь необходима вам или вашему близкому человеку в Бишкеке.
        </p>
      </header>

      <div className={styles.storageNote}>
        РЕЖИМ ХРАНЕНИЯ: {requestService.storageDescription}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Section 1: Main info */}
        <fieldset className={styles.section}>
          <legend className={styles.sectionTitle}>01. Суть обращения</legend>

          <div style={{ marginBottom: '1.25rem' }}>
            <Input
              label="Краткое описание задачи"
              placeholder="Например: Сопровождение к кардиологу или Доставка рецептурных препаратов"
              required
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: undefined });
              }}
              error={errors.title}
            />
          </div>

          <div className={styles.grid2} style={{ marginBottom: '1.25rem' }}>
            <Select
              label="Направление помощи"
              required
              options={categoryOptions}
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value as RequestCategory })
              }
            />

            <Select
              label="Район города"
              required
              options={districtOptions}
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            />
          </div>

          <div className={styles.urgencyGroup}>
            <span className={styles.urgencyHeading}>Срочность выполнения</span>
            <div
              className={styles.urgencyCards}
              role="radiogroup"
              aria-label="Срочность выполнения"
            >
              {(Object.keys(URGENCY_CONFIG) as UrgencyLevel[]).map((level) => {
                const cfg = URGENCY_CONFIG[level];
                const isActive = formData.urgency === level;
                return (
                  <button
                    key={level}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    className={`${styles.urgencyCard} ${isActive ? styles.active : ''}`}
                    onClick={() => setFormData({ ...formData, urgency: level })}
                  >
                    <span className={styles.urgencyLabel}>{cfg.badgeText}</span>
                    <span className={styles.urgencyDesc}>{cfg.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <Textarea
            label="Подробные обстоятельства"
            placeholder="Укажите особенности: требуется ли помощь при спуске по лестнице, нужен ли автомобиль или специальное внимание..."
            required
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              if (errors.description) setErrors({ ...errors, description: undefined });
            }}
            error={errors.description}
            maxLength={1000}
            currentLength={formData.description.length}
            showCharCount
          />
        </fieldset>

        {/* Section 2: Location and Contacts */}
        <fieldset className={styles.section}>
          <legend className={styles.sectionTitle}>02. Маршрут и контактные данные</legend>

          <div style={{ marginBottom: '1.25rem' }}>
            <Input
              label="Точный адрес отправления / встречи"
              placeholder="ул. Киевская 114, кв. 18 или ориентир"
              required
              value={formData.address}
              onChange={(e) => {
                setFormData({ ...formData, address: e.target.value });
                if (errors.address) setErrors({ ...errors, address: undefined });
              }}
              error={errors.address}
            />
          </div>

          <div className={styles.grid2} style={{ marginBottom: '1.25rem' }}>
            <Input
              label="Имя заявителя или опекуна"
              placeholder="Как обращаться к заявителю"
              required
              value={formData.contactName}
              onChange={(e) => {
                setFormData({ ...formData, contactName: e.target.value });
                if (errors.contactName) setErrors({ ...errors, contactName: undefined });
              }}
              error={errors.contactName}
            />

            <Input
              label="Контактный телефон для связи"
              placeholder="+996 (555) 00-00-00"
              required
              value={formData.contactPhone}
              onChange={handlePhoneChange}
              error={errors.contactPhone}
            />
          </div>

          <Input
            label="Желаемое время или дата встречи"
            placeholder="Например: Сегодня до 15:00 или В четверг утром к 09:30"
            required
            value={formData.preferredTime}
            onChange={(e) => {
              setFormData({ ...formData, preferredTime: e.target.value });
              if (errors.preferredTime) setErrors({ ...errors, preferredTime: undefined });
            }}
            error={errors.preferredTime}
          />
        </fieldset>

        {/* Actions */}
        <div className={styles.actionRow}>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Вернуться назад
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
          >
            Зарегистрировать заявку
          </Button>
        </div>
      </form>
    </div>
  );
}
