// src/modules/requests/components/RequestDetailView/RequestDetailView.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  IRequest,
  ApplyRequestDTO,
  CompleteRequestDTO,
  CancelRequestDTO,
  AssignRequestDTO,
} from '../../types';
import { CATEGORIES_CONFIG, URGENCY_CONFIG } from '../../constants';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import { Button } from '@/shared/components/Button/Button';
import { VolunteerApplyModal } from '../VolunteerApplyModal/VolunteerApplyModal';
import { CancelConfirmModal } from '../CancelConfirmModal/CancelConfirmModal';
import { CompleteConfirmModal } from '../CompleteConfirmModal/CompleteConfirmModal';
import { AssignVolunteerModal } from '../AssignVolunteerModal/AssignVolunteerModal';
import { requestService } from '../../api/requestService';
import { useAuth } from '@/modules/auth/authContext';
import { useNotification } from '@/modules/notifications/notificationContext';
import styles from './RequestDetailView.module.scss';

interface RequestDetailViewProps {
  initialRequest: IRequest;
}

export function RequestDetailView({ initialRequest }: RequestDetailViewProps) {
  const { currentUser, isVolunteer, isCoordinator, isApplicant } = useAuth();
  const { success, error, info } = useNotification();

  const [request, setRequest] = useState<IRequest>(initialRequest);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isStartingProgress, setIsStartingProgress] = useState(false);

  const category = CATEGORIES_CONFIG[request.category];
  const urgency = URGENCY_CONFIG[request.urgency];

  const isAssignedVolunteer = isVolunteer && request.volunteerId === currentUser.id;
  const isCreator = isApplicant && request.applicantId === currentUser.id;

  // Handle volunteer apply
  const handleApply = async (dto: ApplyRequestDTO) => {
    try {
      const updated = await requestService.applyForRequest(request.id, dto);
      setRequest(updated);
      success(
        'Отклик принят',
        `Вы назначены волонтёром на заявку «${updated.title}».`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка при отклике';
      error('Не удалось откликнуться', msg);
    }
  };

  // Handle coordinator assign
  const handleAssign = async (dto: AssignRequestDTO) => {
    try {
      const updated = await requestService.assignVolunteer(request.id, dto);
      setRequest(updated);
      success(
        'Волонтёр назначен',
        `Волонтёр ${dto.volunteerName} закреплён за данной заявкой.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка при назначении';
      error('Не удалось назначить волонтёра', msg);
    }
  };

  // Handle start progress
  const handleStartProgress = async () => {
    setIsStartingProgress(true);
    try {
      const updated = await requestService.startProgress(request.id);
      setRequest(updated);
      info('Статус: В пути / В процессе', 'Вы начали выполнение сопровождения.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка обновления статуса';
      error('Не удалось обновить статус', msg);
    } finally {
      setIsStartingProgress(false);
    }
  };

  // Handle complete
  const handleComplete = async (dto: CompleteRequestDTO) => {
    try {
      const updated = await requestService.completeRequest(request.id, dto);
      setRequest(updated);
      success(
        'Заявка успешно выполнена',
        'Сопровождение завершено. Статус обновлён в общем реестре.'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка при завершении';
      error('Не удалось завершить заявку', msg);
    }
  };

  // Handle cancel
  const handleCancel = async (dto: CancelRequestDTO) => {
    try {
      const updated = await requestService.cancelRequest(request.id, dto);
      setRequest(updated);
      info('Заявка отменена', `Причина: ${dto.reason}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка при отмене';
      error('Не удалось отменить заявку', msg);
    }
  };

  // Share link
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      success('Ссылка скопирована', 'Прямая ссылка на маршрут скопирована в буфер обмена.');
    }
  };

  return (
    <div className={styles.wrapper}>
      <Link href="/requests" className={styles.backLink}>
        ← Вернуться к реестру заявок
      </Link>

      <article className={styles.sheet} aria-labelledby="request-detail-title">
        <header className={styles.sheetHeader}>
          <div className={styles.routeMetaRow}>
            <span className={styles.serviceRef}>
              РЕЕСТР СОПРОВОЖДЕНИЯ • {request.id} • {request.district}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#176B55' }}>
                {category.label}
              </span>
              <StatusBadge status={request.status} />
            </div>
          </div>

          <h1 id="request-detail-title" className={styles.title}>
            {request.title}
          </h1>

          {/* Transit Route Progress Line */}
          <div className={styles.routeVisualTrack} aria-label="Этапы сопровождения">
            <div className={styles.trackPoint}>
              <span className={styles.trackDot} />
              <span>Регистрация</span>
            </div>
            <div
              className={`${styles.trackLine} ${
                request.status !== 'PENDING' ? styles.active : ''
              }`}
            />
            <div className={styles.trackPoint}>
              <span
                className={`${styles.trackDot} ${
                  request.status === 'PENDING' ? styles.hollow : ''
                }`}
              />
              <span>Назначение волонтёра</span>
            </div>
            <div
              className={`${styles.trackLine} ${
                request.status === 'COMPLETED' ? styles.active : ''
              }`}
            />
            <div className={styles.trackPoint}>
              <span
                className={`${styles.trackDot} ${
                  request.status === 'COMPLETED' ? '' : styles.hollow
                }`}
              />
              <span>Завершение</span>
            </div>
          </div>
        </header>

        <div className={styles.sheetBody}>
          <div className={styles.infoGrid}>
            <div>
              <div className={styles.sectionHeading}>Обстоятельства и задача</div>
              <p className={styles.description}>{request.description}</p>

              {/* Status Context Alerts */}
              {request.status === 'ASSIGNED' && request.volunteerName && (
                <div className={`${styles.statusNotice} ${styles.assigned}`}>
                  <strong>Волонтёр сопровождения назначен:</strong> {request.volunteerName}
                  {request.volunteerPhone && (
                    <div>
                      Контактный телефон: <strong>{request.volunteerPhone}</strong>
                    </div>
                  )}
                </div>
              )}

              {request.status === 'COMPLETED' && (
                <div className={`${styles.statusNotice} ${styles.completed}`}>
                  <strong>Сопровождение успешно выполнено.</strong>
                  {request.completionNotes && (
                    <div style={{ marginTop: '0.35rem' }}>
                      Отметка волонтёра: <em>«{request.completionNotes}»</em>
                    </div>
                  )}
                </div>
              )}

              {request.status === 'CANCELLED' && (
                <div className={`${styles.statusNotice} ${styles.cancelled}`}>
                  <strong>Заявка снята с реестра.</strong>
                  {request.cancellationReason && (
                    <div style={{ marginTop: '0.35rem' }}>
                      Причина: <em>«{request.cancellationReason}»</em>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar metadata */}
            <aside className={styles.sidebarBox}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Место встречи</span>
                <span className={styles.detailValue}>{request.address}</span>
                <span style={{ fontSize: '0.8rem', color: '#788A82' }}>
                  {request.district}
                </span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Сроки</span>
                <span className={styles.detailValue}>{request.preferredTime}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Срочность</span>
                <span className={styles.detailValue}>{urgency.badgeText}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Контактное лицо</span>
                <span className={styles.detailValue}>{request.contactName}</span>
                <a
                  href={`tel:${request.contactPhone}`}
                  style={{
                    fontSize: '0.875rem',
                    color: '#176B55',
                    fontWeight: 600,
                    textDecoration: 'underline',
                  }}
                >
                  {request.contactPhone}
                </a>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Время регистрации</span>
                <span style={{ fontSize: '0.825rem', color: '#4A5B53' }}>
                  {new Date(request.createdAt).toLocaleString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </aside>
          </div>
        </div>

        {/* Toolbar */}
        <footer className={styles.toolbar}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
          >
            Скопировать ссылку на маршрут
          </Button>

          <div className={styles.actionGroup}>
            {/* Volunteer Apply Button */}
            {isVolunteer && request.status === 'PENDING' && (
              <Button
                variant="primary"
                onClick={() => setIsApplyModalOpen(true)}
              >
                Откликнуться на сопровождение
              </Button>
            )}

            {/* Coordinator Assign Button */}
            {isCoordinator && request.status === 'PENDING' && (
              <Button
                variant="primary"
                onClick={() => setIsAssignModalOpen(true)}
              >
                Назначить волонтёра
              </Button>
            )}

            {/* Volunteer Start Progress */}
            {isAssignedVolunteer && request.status === 'ASSIGNED' && (
              <Button
                variant="secondary"
                onClick={handleStartProgress}
                isLoading={isStartingProgress}
              >
                Начать выполнение
              </Button>
            )}

            {/* Complete Button */}
            {(isAssignedVolunteer || isCoordinator) &&
              (request.status === 'ASSIGNED' || request.status === 'IN_PROGRESS') && (
                <Button
                  variant="accent"
                  onClick={() => setIsCompleteModalOpen(true)}
                >
                  Подтвердить завершение
                </Button>
              )}

            {/* Cancel Button */}
            {(isCoordinator || isCreator) &&
              request.status !== 'COMPLETED' &&
              request.status !== 'CANCELLED' && (
                <Button
                  variant="outline"
                  onClick={() => setIsCancelModalOpen(true)}
                >
                  Отменить заявку
                </Button>
              )}
          </div>
        </footer>
      </article>

      {/* Modals */}
      <VolunteerApplyModal
        request={request}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onConfirm={handleApply}
      />

      <AssignVolunteerModal
        request={request}
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onAssign={handleAssign}
      />

      <CancelConfirmModal
        request={request}
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancel}
      />

      <CompleteConfirmModal
        request={request}
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onConfirm={handleComplete}
      />
    </div>
  );
}
