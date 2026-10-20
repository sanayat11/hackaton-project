// src/modules/coordinator/components/CoordinatorDashboard/CoordinatorDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IRequest, AssignRequestDTO, CancelRequestDTO, CompleteRequestDTO } from '@/modules/requests/types';
import { requestService } from '@/modules/requests/api/requestService';
import { StatusBadge } from '@/modules/requests/components/StatusBadge/StatusBadge';
import { AssignVolunteerModal } from '@/modules/requests/components/AssignVolunteerModal/AssignVolunteerModal';
import { CancelConfirmModal } from '@/modules/requests/components/CancelConfirmModal/CancelConfirmModal';
import { CompleteConfirmModal } from '@/modules/requests/components/CompleteConfirmModal/CompleteConfirmModal';
import { Button } from '@/shared/components/Button/Button';
import { useAuth } from '@/modules/auth/authContext';
import { useNotification } from '@/modules/notifications/notificationContext';
import styles from './CoordinatorDashboard.module.scss';

export function CoordinatorDashboard() {
  const { currentUser, isCoordinator, switchRole } = useAuth();
  const { success, error } = useNotification();

  const [requests, setRequests] = useState<IRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [assignTarget, setAssignTarget] = useState<IRequest | null>(null);
  const [cancelTarget, setCancelTarget] = useState<IRequest | null>(null);
  const [completeTarget, setCompleteTarget] = useState<IRequest | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    requestService
      .getRequests()
      .then((data) => {
        if (active) setRequests(data);
      })
      .catch(() => {
        if (active) error('Ошибка', 'Не удалось загрузить данные координатора');
      });

    return () => {
      active = false;
    };
  }, [refreshKey, error]);

  // Metrics calculation
  const totalCount = requests.length;
  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
  const activeCount = requests.filter(
    (r) => r.status === 'ASSIGNED' || r.status === 'IN_PROGRESS'
  ).length;
  const completedCount = requests.filter((r) => r.status === 'COMPLETED').length;
  const urgentCount = requests.filter(
    (r) => r.urgency === 'high' && r.status === 'PENDING'
  ).length;

  // Filtered list
  const filteredRequests = requests.filter((r) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'urgent') return r.urgency === 'high' && r.status === 'PENDING';
    return r.status === filterStatus;
  });

  const handleAssign = async (dto: AssignRequestDTO) => {
    if (!assignTarget) return;
    try {
      await requestService.assignVolunteer(assignTarget.id, dto);
      success(
        'Волонтёр назначен',
        `Волонтёр ${dto.volunteerName} назначен на заявку «${assignTarget.title}»`
      );
      setAssignTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка назначения';
      error('Ошибка', msg);
    }
  };

  const handleCancel = async (dto: CancelRequestDTO) => {
    if (!cancelTarget) return;
    try {
      await requestService.cancelRequest(cancelTarget.id, dto);
      success(
        'Заявка отменена',
        `Заявка «${cancelTarget.title}» отменена: ${dto.reason}`
      );
      setCancelTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка отмены';
      error('Ошибка', msg);
    }
  };

  const handleComplete = async (dto: CompleteRequestDTO) => {
    if (!completeTarget) return;
    try {
      await requestService.completeRequest(completeTarget.id, dto);
      success('Заявка завершена', `Заявка «${completeTarget.title}» закрыта`);
      setCompleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка завершения';
      error('Ошибка', msg);
    }
  };

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.serviceRef}>ЖОЛДОШ • ОПЕРАТИВНАЯ ПАНЕЛЬ КООРДИНАТОРА</div>
        <h1 className={styles.title}>Диспетчерский пульт сопровождения</h1>
        <p className={styles.subtitle}>
          Дежурный координатор: <strong>{currentUser.name}</strong> • Сводка по районам Бишкека
        </p>
      </header>

      {!isCoordinator && (
        <div
          style={{
            backgroundColor: '#FAF2E6',
            border: '1px solid rgba(240, 184, 110, 0.5)',
            padding: '1rem 1.25rem',
            borderRadius: '4px',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <strong>Интерфейс открыт в другой роли.</strong>
            <p style={{ fontSize: '0.85rem', color: '#613C08', marginTop: '0.2rem' }}>
              Переключитесь на роль «Координатор» для доступа к оперативному назначению волонтёров.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => switchRole('COORDINATOR')}
          >
            Включить роль Координатора
          </Button>
        </div>
      )}

      {/* Metrics Row */}
      <div className={styles.metricsRow}>
        <div className={`${styles.metricCard} ${urgentCount > 0 ? styles.urgentCard : ''}`}>
          <span className={styles.metricNum}>{urgentCount}</span>
          <span className={styles.metricLabel}>Срочных без назначения</span>
        </div>

        <div className={`${styles.metricCard} ${styles.pendingCard}`}>
          <span className={styles.metricNum}>{pendingCount}</span>
          <span className={styles.metricLabel}>Ожидают волонтёра</span>
        </div>

        <div className={styles.metricCard}>
          <span className={styles.metricNum}>{activeCount}</span>
          <span className={styles.metricLabel}>Маршрутов в процессе</span>
        </div>

        <div className={styles.metricCard}>
          <span className={styles.metricNum}>{completedCount}</span>
          <span className={styles.metricLabel}>Выполнено за период</span>
        </div>

        <div className={styles.metricCard}>
          <span className={styles.metricNum}>{totalCount}</span>
          <span className={styles.metricLabel}>Всего заявок в базе</span>
        </div>
      </div>

      {/* Requests Management Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableToolbar}>
          <span className={styles.tableTitle}>Реестр заявок на сопровождение</span>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button
              variant={filterStatus === 'all' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              Все ({totalCount})
            </Button>
            <Button
              variant={filterStatus === 'urgent' ? 'accent' : 'ghost'}
              size="sm"
              onClick={() => setFilterStatus('urgent')}
            >
              Срочные ({urgentCount})
            </Button>
            <Button
              variant={filterStatus === 'PENDING' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilterStatus('PENDING')}
            >
              Ищут ({pendingCount})
            </Button>
            <Button
              variant={filterStatus === 'ASSIGNED' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilterStatus('ASSIGNED')}
            >
              Назначены
            </Button>
            <Button
              variant={filterStatus === 'COMPLETED' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilterStatus('COMPLETED')}
            >
              Завершены ({completedCount})
            </Button>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table} aria-label="Таблица оперативного контроля заявок">
            <thead>
              <tr>
                <th scope="col">Обращение</th>
                <th scope="col">Приоритет</th>
                <th scope="col">Район</th>
                <th scope="col">Статус</th>
                <th scope="col">Волонтёр</th>
                <th scope="col">Действия диспетчера</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.id}>
                  <td>
                    <Link href={`/requests/${req.id}`} className={styles.rowTitle}>
                      {req.title}
                    </Link>
                    <span className={styles.rowAddress}>
                      {req.address} • {req.contactName} ({req.contactPhone})
                    </span>
                  </td>

                  <td>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color:
                          req.urgency === 'high'
                            ? '#C0392B'
                            : req.urgency === 'medium'
                            ? '#613C08'
                            : '#176B55',
                      }}
                    >
                      {req.urgency === 'high'
                        ? '[СРОЧНО]'
                        : req.urgency === 'medium'
                        ? '[СРЕДНЯЯ]'
                        : '[ОБЫЧНАЯ]'}
                    </span>
                  </td>

                  <td>{req.district}</td>

                  <td>
                    <StatusBadge status={req.status} />
                  </td>

                  <td>
                    {req.volunteerName ? (
                      <div>
                        <strong>{req.volunteerName}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#788A82' }}>
                          {req.volunteerPhone}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: '#788A82', fontStyle: 'italic', fontSize: '0.8rem' }}>
                        Не назначен
                      </span>
                    )}
                  </td>

                  <td>
                    <div className={styles.actionCell}>
                      <Link href={`/requests/${req.id}`}>
                        <Button variant="ghost" size="sm">
                          Просмотр
                        </Button>
                      </Link>

                      {req.status === 'PENDING' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setAssignTarget(req)}
                        >
                          Назначить
                        </Button>
                      )}

                      {(req.status === 'ASSIGNED' || req.status === 'IN_PROGRESS') && (
                        <Button
                          variant="accent"
                          size="sm"
                          onClick={() => setCompleteTarget(req)}
                        >
                          Завершить
                        </Button>
                      )}

                      {req.status !== 'COMPLETED' && req.status !== 'CANCELLED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCancelTarget(req)}
                        >
                          Отменить
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals for coordinator */}
      <AssignVolunteerModal
        request={assignTarget}
        isOpen={Boolean(assignTarget)}
        onClose={() => setAssignTarget(null)}
        onAssign={handleAssign}
      />

      <CancelConfirmModal
        request={cancelTarget}
        isOpen={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
      />

      <CompleteConfirmModal
        request={completeTarget}
        isOpen={Boolean(completeTarget)}
        onClose={() => setCompleteTarget(null)}
        onConfirm={handleComplete}
      />
    </div>
  );
}
