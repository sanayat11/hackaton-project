// src/modules/requests/components/RequestCard/RequestCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { IRequest } from '../../types';
import { CATEGORIES_CONFIG, URGENCY_CONFIG } from '../../constants';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import { Button } from '@/shared/components/Button/Button';
import { useAuth } from '@/modules/auth/authContext';
import {
  MapPinIcon,
  ClockIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  UserIcon,
} from '@/shared/components/Icons';
import styles from './RequestCard.module.scss';

interface RequestCardProps {
  request: IRequest;
  onApply?: (request: IRequest) => void;
  onCancel?: (request: IRequest) => void;
  onComplete?: (request: IRequest) => void;
}

export function RequestCard({
  request,
  onApply,
  onCancel,
  onComplete,
}: RequestCardProps) {
  const { currentUser, isVolunteer, isCoordinator, isApplicant } = useAuth();
  const category = CATEGORIES_CONFIG[request.category];
  const urgency = URGENCY_CONFIG[request.urgency];

  const isAssignedToCurrentVolunteer =
    isVolunteer && request.volunteerId === currentUser.id;
  const isCreatedByCurrentApplicant =
    isApplicant && request.applicantId === currentUser.id;

  const cardUrgencyClass =
    request.urgency === 'high'
      ? styles.highUrgency
      : request.urgency === 'medium'
      ? styles.mediumUrgency
      : '';

  return (
    <article
      className={`${styles.card} ${cardUrgencyClass}`}
      aria-labelledby={`req-title-${request.id}`}
    >
      <div className={styles.cardTop}>
        {/* Top Badges & Meta */}
        <div className={styles.cardHeader}>
          <div className={styles.categoryPill}>
            <span>{category.label}</span>
          </div>

          <div className={styles.statusBadgesGroup}>
            <span className={`${styles.urgencyBadge} ${styles[request.urgency]}`}>
              {urgency.badgeText}
            </span>
            <StatusBadge status={request.status} />
          </div>
        </div>

        {/* Applicant Meta */}
        <div className={styles.applicantRow}>
          <div className={styles.applicantAvatar}>
            <UserIcon size={14} />
          </div>
          <span className={styles.applicantName}>{request.applicantName}</span>
          <span className={styles.dotSeparator}>•</span>
          <span className={styles.districtText}>{request.district}</span>
        </div>

        {/* Request Title */}
        <h3 id={`req-title-${request.id}`} className={styles.title}>
          <Link href={`/requests/${request.id}`}>{request.title}</Link>
        </h3>

        {/* Short Description */}
        <p className={styles.description}>{request.description}</p>

        {/* Route Details Box */}
        <div className={styles.waypointBox}>
          <div className={styles.waypointRow}>
            <MapPinIcon size={16} className={styles.pinIcon} />
            <div className={styles.waypointText}>
              <span className={styles.waypointLabel}>Маршрут / Адрес</span>
              <strong className={styles.waypointValue}>{request.address}</strong>
            </div>
          </div>

          <div className={styles.waypointRow}>
            <ClockIcon size={16} className={styles.clockIcon} />
            <div className={styles.waypointText}>
              <span className={styles.waypointLabel}>Время сопровождения</span>
              <span className={styles.waypointValue}>{request.preferredTime}</span>
            </div>
          </div>
        </div>

        {/* Assigned Volunteer Banner */}
        {request.volunteerName && (
          <div className={styles.assignedBanner}>
            <ShieldCheckIcon size={16} className={styles.shieldIcon} />
            <div>
              <span>Назначенный волонтёр:</span>
              <strong>{request.volunteerName}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className={styles.actions}>
        <Link href={`/requests/${request.id}`} className={styles.detailsLink}>
          <span>Подробнее</span>
          <ArrowRightIcon size={14} />
        </Link>

        {/* Volunteer Apply Button */}
        {isVolunteer && request.status === 'PENDING' && onApply && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onApply(request)}
          >
            <span>Откликнуться</span>
          </Button>
        )}

        {/* Volunteer Complete Action */}
        {isAssignedToCurrentVolunteer &&
          (request.status === 'ASSIGNED' || request.status === 'IN_PROGRESS') &&
          onComplete && (
            <Button
              variant="accent"
              size="sm"
              onClick={() => onComplete(request)}
            >
              <span>Завершить</span>
            </Button>
          )}

        {/* Applicant / Coordinator Cancel Action */}
        {(isCreatedByCurrentApplicant || isCoordinator) &&
          request.status !== 'COMPLETED' &&
          request.status !== 'CANCELLED' &&
          onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCancel(request)}
            >
              <span>Отменить</span>
            </Button>
          )}
      </div>
    </article>
  );
}
