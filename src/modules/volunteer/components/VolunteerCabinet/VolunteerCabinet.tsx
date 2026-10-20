// src/modules/volunteer/components/VolunteerCabinet/VolunteerCabinet.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IRequest, CompleteRequestDTO } from '@/modules/requests/types';
import { requestService } from '@/modules/requests/api/requestService';
import { RequestCard } from '@/modules/requests/components/RequestCard/RequestCard';
import { CompleteConfirmModal } from '@/modules/requests/components/CompleteConfirmModal/CompleteConfirmModal';
import { useAuth } from '@/modules/auth/authContext';
import { useNotification } from '@/modules/notifications/notificationContext';
import { Button } from '@/shared/components/Button/Button';
import styles from './VolunteerCabinet.module.scss';

export function VolunteerCabinet() {
  const { currentUser, isVolunteer, switchRole } = useAuth();
  const { success, error } = useNotification();

  const [requests, setRequests] = useState<IRequest[]>([]);
  const [completeTarget, setCompleteTarget] = useState<IRequest | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    requestService
      .getRequests()
      .then((all) => {
        if (active) setRequests(all);
      })
      .catch(() => {
        if (active) error('Ошибка загрузки', 'Не удалось загрузить данные волонтёра');
      });

    return () => {
      active = false;
    };
  }, [refreshKey, error]);

  const activeTasks = requests.filter(
    (r) =>
      r.volunteerId === currentUser.id &&
      (r.status === 'ASSIGNED' || r.status === 'IN_PROGRESS')
  );

  const completedTasks = requests.filter(
    (r) => r.volunteerId === currentUser.id && r.status === 'COMPLETED'
  );

  const handleCompleteConfirm = async (dto: CompleteRequestDTO) => {
    if (!completeTarget) return;
    try {
      await requestService.completeRequest(completeTarget.id, dto);
      success(
        'Заявка завершена',
        `Вы успешно завершили выполнение заявки «${completeTarget.title}»`
      );
      setCompleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка при завершении';
      error('Ошибка', msg);
    }
  };

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.serviceRef}>JOCARE • РАБОЧИЙ КАБИНЕТ ВОЛОНТЁРА</div>
        <h1 className={styles.title}>Журнал сопровождения волонтёра</h1>
        <p className={styles.subtitle}>
          Волонтёр: <strong>{currentUser.name}</strong> • Район: Октябрьский / Первомайский • Тел: {currentUser.phone}
        </p>
      </header>

      {!isVolunteer && (
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
            <strong>Вы просматриваете страницу в режиме «Заявитель».</strong>
            <p style={{ fontSize: '0.85rem', color: '#613C08', marginTop: '0.2rem' }}>
              Переключитесь на роль «Волонтёр», чтобы брать маршруты и управлять заданиями.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => switchRole('VOLUNTEER')}
          >
            Включить роль Волонтёра
          </Button>
        </div>
      )}

      {/* Practical Work Stats */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{activeTasks.length}</span>
          <span className={styles.statLabel}>Маршрутов в работе сейчас</span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statValue}>
            {completedTasks.length + (currentUser.completedTasksCount || 0)}
          </span>
          <span className={styles.statLabel}>Завершённых сопровождений</span>
        </div>

        <div className={styles.statItem}>
          <div className={styles.ratingValueRow}>
            <span className={styles.statValue}>{currentUser.rating || 4.9}</span>
            <span className={styles.statStar}>★</span>
          </div>
          <span className={styles.statLabel}>Индекс надёжности волонтёра</span>
        </div>
      </div>

      {/* Volunteer Achievements & Recognition */}
      <section className={styles.achievementsSection} aria-labelledby="achievements-title">
        <div className={styles.achievementsHeader}>
          <div>
            <h2 id="achievements-title" className={styles.achievementsTitle}>
              Достижения и признание волонтёра
            </h2>
            <p className={styles.achievementsSub}>
              Подтверждённый социальный рейтинг в системе сопровождения города Бишкек
            </p>
          </div>
          <span className={styles.levelBadge}>Уровень: Надёжный попутчик II</span>
        </div>

        <div className={styles.badgesGrid}>
          <div className={styles.badgeCardUnlocked}>
            <div className={styles.badgeGlowRing} />
            <div className={styles.badgeIcon}>🏆</div>
            <div className={styles.badgeContent}>
              <strong>Первые 5 поездок</strong>
              <span>Успешный старт в рядах службы</span>
              <span className={styles.unlockedTag}>Разблокировано ✓</span>
            </div>
          </div>

          <div className={styles.badgeCardUnlocked}>
            <div className={styles.badgeGlowRing} />
            <div className={styles.badgeIcon}>🤝</div>
            <div className={styles.badgeContent}>
              <strong>Надёжный попутчик</strong>
              <span>100% маршрутов завершены вовремя</span>
              <span className={styles.unlockedTag}>Разблокировано ✓</span>
            </div>
          </div>

          <div className={styles.badgeCardUnlocked}>
            <div className={styles.badgeGlowRing} />
            <div className={styles.badgeIcon}>💚</div>
            <div className={styles.badgeContent}>
              <strong>10 часов помощи</strong>
              <span>Существенный социальный вклад</span>
              <span className={styles.unlockedTag}>Разблокировано ✓</span>
            </div>
          </div>

          <div className={styles.badgeCardLocked}>
            <div className={styles.badgeIcon}>🚀</div>
            <div className={styles.badgeContent}>
              <strong>25 сопровождений</strong>
              <span>14 / 25 завершено</span>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '56%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active tasks */}
      <section aria-labelledby="active-tasks-title">
        <h2 id="active-tasks-title" className={styles.sectionHeading}>
          Текущие маршруты сопровождения ({activeTasks.length})
        </h2>

        {activeTasks.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>У вас нет назначенных маршрутов на сегодня</h3>
            <p>
              Ознакомьтесь со списком открытых заявок в городе и выберите удобный маршрут.
            </p>
            <Link href="/requests">
              <Button variant="primary">Открыть реестр заявок</Button>
            </Link>
          </div>
        ) : (
          <div className={styles.tasksGrid}>
            {activeTasks.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                onComplete={(r) => setCompleteTarget(r)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Completed history */}
      {completedTasks.length > 0 && (
        <section aria-labelledby="completed-tasks-title">
          <h2 id="completed-tasks-title" className={styles.sectionHeading}>
            Архив выполненных маршрутов ({completedTasks.length})
          </h2>
          <div className={styles.tasksGrid}>
            {completedTasks.map((req) => (
              <RequestCard key={req.id} request={req} />
            ))}
          </div>
        </section>
      )}

      {/* Complete Modal */}
      <CompleteConfirmModal
        request={completeTarget}
        isOpen={Boolean(completeTarget)}
        onClose={() => setCompleteTarget(null)}
        onConfirm={handleCompleteConfirm}
      />
    </div>
  );
}
