// src/modules/requests/components/RequestFilter/RequestFilter.tsx
'use client';

import React from 'react';
import { RequestFiltersState, RequestCategory, UrgencyLevel, RequestStatus } from '../../types';
import { CATEGORIES_CONFIG, STATUS_OPTIONS } from '../../constants';
import { Input } from '@/shared/components/Input/Input';
import { Select } from '@/shared/components/Select/Select';
import { SearchIcon } from '@/shared/components/Icons';
import styles from './RequestFilter.module.scss';

interface RequestFilterProps {
  filters: RequestFiltersState;
  onChange: (filters: RequestFiltersState) => void;
  totalFound: number;
}

export function RequestFilter({ filters, onChange, totalFound }: RequestFilterProps) {
  const handleSearch = (value: string) => {
    onChange({ ...filters, searchQuery: value });
  };

  const handleCategory = (cat: RequestCategory | 'all') => {
    onChange({ ...filters, category: cat });
  };

  const handleUrgency = (urg: UrgencyLevel | 'all') => {
    onChange({ ...filters, urgency: urg });
  };

  const handleStatus = (st: RequestStatus | 'all') => {
    onChange({ ...filters, status: st });
  };

  const handleSort = (sort: 'date_desc' | 'date_asc' | 'urgency_desc') => {
    onChange({ ...filters, sortBy: sort });
  };

  const handleReset = () => {
    onChange({
      searchQuery: '',
      category: 'all',
      urgency: 'all',
      status: 'all',
      sortBy: 'date_desc',
    });
  };

  const urgencyOptions = [
    { value: 'all', label: 'Любая срочность' },
    { value: 'high', label: 'Высокая (срочно)' },
    { value: 'medium', label: 'Средняя' },
    { value: 'low', label: 'Обычная' },
  ];

  const sortOptions = [
    { value: 'date_desc', label: 'Сначала новые' },
    { value: 'date_asc', label: 'Сначала ранние' },
    { value: 'urgency_desc', label: 'Сначала высокий приоритет' },
  ];

  return (
    <div className={styles.filterBox} role="search" aria-label="Параметры поиска и фильтрации заявок">
      <div className={styles.categoryPills} role="radiogroup" aria-label="Фильтр по категориям помощи">
        <button
          type="button"
          role="radio"
          aria-checked={filters.category === 'all'}
          className={`${styles.categoryPill} ${filters.category === 'all' ? styles.active : ''}`}
          onClick={() => handleCategory('all')}
        >
          <span>Все направления</span>
        </button>
        {(Object.keys(CATEGORIES_CONFIG) as RequestCategory[]).map((catKey) => {
          const cfg = CATEGORIES_CONFIG[catKey];
          const isActive = filters.category === catKey;
          return (
            <button
              key={catKey}
              type="button"
              role="radio"
              aria-checked={isActive}
              className={`${styles.categoryPill} ${isActive ? styles.active : ''}`}
              onClick={() => handleCategory(catKey)}
            >
              <span>{cfg.label}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.topRow}>
        <div className={styles.searchInput}>
          <Input
            placeholder="Поиск по адресу, названию, улице или ориентиру в Бишкеке..."
            value={filters.searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            prefixIcon={<SearchIcon size={18} />}
          />
        </div>
      </div>

      <div className={styles.selectsRow}>
        <Select
          label="Срочность"
          options={urgencyOptions}
          value={filters.urgency}
          onChange={(e) => handleUrgency(e.target.value as UrgencyLevel | 'all')}
        />

        <Select
          label="Статус заявки"
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={(e) => handleStatus(e.target.value as RequestStatus | 'all')}
        />

        <Select
          label="Порядок сортировки"
          options={sortOptions}
          value={filters.sortBy}
          onChange={(e) =>
            handleSort(e.target.value as 'date_desc' | 'date_asc' | 'urgency_desc')
          }
        />
      </div>

      <div className={styles.bottomBar}>
        <span className={styles.counter}>
          Записей в реестре: <strong>{totalFound}</strong>
        </span>
        {(filters.searchQuery ||
          filters.category !== 'all' ||
          filters.urgency !== 'all' ||
          filters.status !== 'all' ||
          filters.sortBy !== 'date_desc') && (
          <button type="button" onClick={handleReset} className={styles.resetBtn}>
            Сбросить фильтры
          </button>
        )}
      </div>
    </div>
  );
}
