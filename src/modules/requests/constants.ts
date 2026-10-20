// src/modules/requests/constants.ts
import { RequestCategory, UrgencyLevel, RequestStatus } from './types';

export const CATEGORIES_CONFIG: Record<
  RequestCategory,
  { label: string; icon: string; description: string }
> = {
  delivery: {
    label: 'Доставка продуктов/лекарств',
    icon: '📦',
    description: 'Покупка и доставка товаров первой необходимости',
  },
  social: {
    label: 'Помощь пожилым / уход',
    icon: '👵',
    description: 'Социальная поддержка, сопровождение, бытовое внимание',
  },
  auto: {
    label: 'Транспорт и автопомощь',
    icon: '🚗',
    description: 'Поездки в больницы, реабилитацию, перевозка грузов',
  },
  repair: {
    label: 'Бытовой ремонт',
    icon: '🔧',
    description: 'Мелкий ремонт сантехники, электрики, помощь по дому',
  },
  education: {
    label: 'Обучение / цифровые навыки',
    icon: '📱',
    description: 'Помощь с госуслугами, смартфонами, компьютером',
  },
  emergency: {
    label: 'Срочная помощь',
    icon: '🚨',
    description: 'Экстренная помощь при форс-мажорах и поломках',
  },
};

export const URGENCY_CONFIG: Record<
  UrgencyLevel,
  { label: string; badgeText: string; color: string; icon: string }
> = {
  high: {
    label: 'Срочно (в течение нескольких часов)',
    badgeText: 'Высокая срочность',
    color: '#D32F2F',
    icon: '🔥',
  },
  medium: {
    label: 'Средняя (в течение 1-2 дней)',
    badgeText: 'Средний приоритет',
    color: '#D97706',
    icon: '⚡',
  },
  low: {
    label: 'Обычная (в течение недели)',
    badgeText: 'Обычный приоритет',
    color: '#176B55',
    icon: '🌱',
  },
};

export const DISTRICTS = [
  'Первомайский район',
  'Ленинский район',
  'Октябрьский район',
  'Свердловский район',
  'Пригород / Чуйская область',
];

export const STATUS_OPTIONS: { value: RequestStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Все статусы' },
  { value: 'PENDING', label: 'Ищет волонтёра' },
  { value: 'ASSIGNED', label: 'Волонтёр назначен' },
  { value: 'IN_PROGRESS', label: 'В процессе' },
  { value: 'COMPLETED', label: 'Завершенные' },
  { value: 'CANCELLED', label: 'Отмененные' },
];
