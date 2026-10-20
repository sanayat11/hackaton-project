// src/modules/requests/components/RequestFeed/RequestFeed.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  IRequest,
  RequestFiltersState,
  ApplyRequestDTO,
  CancelRequestDTO,
  CompleteRequestDTO,
} from '../../types';
import { requestService } from '../../api/requestService';
import { RequestCard } from '../RequestCard/RequestCard';
import { RequestFilter } from '../RequestFilter/RequestFilter';
import { VolunteerApplyModal } from '../VolunteerApplyModal/VolunteerApplyModal';
import { CancelConfirmModal } from '../CancelConfirmModal/CancelConfirmModal';
import { CompleteConfirmModal } from '../CompleteConfirmModal/CompleteConfirmModal';
import { Button } from '@/shared/components/Button/Button';
import { useNotification } from '@/modules/notifications/notificationContext';
import styles from './RequestFeed.module.scss';

export function RequestFeed() {
  const { success, error } = useNotification();

  const [requests, setRequests] = useState<IRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const [filters, setFilters] = useState<RequestFiltersState>({
    searchQuery: '',
    category: 'all',
    urgency: 'all',
    status: 'all',
    sortBy: 'date_desc',
  });

  const [applyTarget, setApplyTarget] = useState<IRequest | null>(null);
  const [cancelTarget, setCancelTarget] = useState<IRequest | null>(null);
  const [completeTarget, setCompleteTarget] = useState<IRequest | null>(null);

  useEffect(() => {
    let active = true;
    requestService
      .getRequests(filters)
      .then((data) => {
        if (active) {
          setRequests(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          error('Ошибка загрузки', 'Не удалось загрузить реестр заявок');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [filters, refreshKey, error]);

  const handleApplyConfirm = async (dto: ApplyRequestDTO) => {
    if (!applyTarget) return;
    try {
      await requestService.applyForRequest(applyTarget.id, dto);
      success(
        'Отклик принят',
        `Вы назначены волонтёром на заявку «${applyTarget.title}»`
      );
      setApplyTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка при отклике';
      error('Ошибка', msg);
    }
  };

  const handleCancelConfirm = async (dto: CancelRequestDTO) => {
    if (!cancelTarget) return;
    try {
      await requestService.cancelRequest(cancelTarget.id, dto);
      success('Заявка отменена', `Причина отмены: ${dto.reason}`);
      setCancelTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка при отмене';
      error('Ошибка', msg);
    }
  };

  const handleCompleteConfirm = async (dto: CompleteRequestDTO) => {
    if (!completeTarget) return;
    try {
      await requestService.completeRequest(completeTarget.id, dto);
      success('Заявка завершена', `Сопровождение по заявке «${completeTarget.title}» завершено`);
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
        <div>
          <div className={styles.serviceRef}>ЖОЛДОШ • РЕЕСТР СОПРОВОЖДЕНИЯ</div>
          <h1 className={styles.title}>Реестр заявок на сопровождение</h1>
          <p className={styles.subtitle}>
            Открытый городской каталог обращений горожан, нуждающихся в сопровождении или адресной помощи в Бишкеке.
          </p>
        </div>

        <Link href="/requests/new">
          <Button variant="primary" size="lg">
            Подать новую заявку
          </Button>
        </Link>
      </header>

      <RequestFilter
        filters={filters}
        onChange={(newFilters) => setFilters(newFilters)}
        totalFound={requests.length}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#176B55' }}>
          Загрузка записей реестра...
        </div>
      ) : requests.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>Заявок по заданным критериям не найдено</h3>
          <p>Попробуйте сбросить фильтры или изменить район поиска.</p>
          <Button
            variant="outline"
            onClick={() =>
              setFilters({
                searchQuery: '',
                category: 'all',
                urgency: 'all',
                status: 'all',
                sortBy: 'date_desc',
              })
            }
          >
            Сбросить фильтры
          </Button>
        </div>
      ) : (
        <div className={styles.grid}>
          {requests.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              onApply={(r) => setApplyTarget(r)}
              onCancel={(r) => setCancelTarget(r)}
              onComplete={(r) => setCompleteTarget(r)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <VolunteerApplyModal
        request={applyTarget}
        isOpen={Boolean(applyTarget)}
        onClose={() => setApplyTarget(null)}
        onConfirm={handleApplyConfirm}
      />

      <CancelConfirmModal
        request={cancelTarget}
        isOpen={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancelConfirm}
      />

      <CompleteConfirmModal
        request={completeTarget}
        isOpen={Boolean(completeTarget)}
        onClose={() => setCompleteTarget(null)}
        onConfirm={handleCompleteConfirm}
      />
    </div>
  );
}
