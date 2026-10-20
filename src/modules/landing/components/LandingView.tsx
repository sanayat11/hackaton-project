// src/modules/landing/components/LandingView.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IRequest } from '@/modules/requests/types';
import { requestService } from '@/modules/requests/api/requestService';
import { RequestCard } from '@/modules/requests/components/RequestCard/RequestCard';
import { VolunteerApplyModal } from '@/modules/requests/components/VolunteerApplyModal/VolunteerApplyModal';
import { Button } from '@/shared/components/Button/Button';
import { useNotification } from '@/modules/notifications/notificationContext';
import {
  MapPinIcon,
  ShieldCheckIcon,
  ClockIcon,
  ArrowRightIcon,
  FirstAidIcon,
  CarIcon,
  HeartHandshakeIcon,
  SparklesIcon,
  AwardIcon,
  StarIcon,
  CheckCircleIcon,
  UsersIcon,
  PhoneIcon,
  KyrgyzMotifIcon,
} from '@/shared/components/Icons';
import { useScrollReveal } from '@/shared/hooks/useScrollReveal';
import styles from './LandingView.module.scss';

const JOURNEY_STEPS = [
  {
    step: '01',
    status: 'Нужна помощь',
    title: 'Заявка за 1 минуту',
    desc: 'Заявитель или родственник указывает начальную точку, пункт назначения и особенности (коляска, костыли, авто).',
    icon: ClockIcon,
  },
  {
    step: '02',
    status: 'Волонтёр найден',
    title: 'Отклик в районе',
    desc: 'Волонтёры в нужном районе Бишкека получают уведомление, видят точный маршрут и подтверждают готовность.',
    icon: UsersIcon,
  },
  {
    step: '03',
    status: 'Сопровождение',
    title: 'Безопасная встреча',
    desc: 'Волонтёр созванивается по телефону, встречает у подъезда и надёжно сопровождает на всём пути.',
    icon: HeartHandshakeIcon,
  },
  {
    step: '04',
    status: 'Завершено ✓',
    title: 'Фиксация и доверие',
    desc: 'Координатор фиксирует закрытие маршрута. Социальные часы волонтёра зачисляются в верифицированный профиль.',
    icon: ShieldCheckIcon,
  },
];

export function LandingView() {
  const { success, error } = useNotification();
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [applyTarget, setApplyTarget] = useState<IRequest | null>(null);
  const [activeJourneyStep, setActiveJourneyStep] = useState(0);

  // Scroll reveal hooks for silky entrance animations
  const journeyReveal = useScrollReveal<HTMLDivElement>();
  const impactReveal = useScrollReveal<HTMLDivElement>();
  const spheresReveal = useScrollReveal<HTMLDivElement>();
  const directoryReveal = useScrollReveal<HTMLDivElement>();
  const trustReveal = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    let active = true;
    requestService
      .getRequests()
      .then((data) => {
        if (active) setRequests(data);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const openRequests = requests
    .filter((r) => r.status === 'PENDING')
    .slice(0, 3);

  const handleApplyConfirm = async (dto: {
    volunteerId: string;
    volunteerName: string;
    volunteerPhone: string;
    message?: string;
  }) => {
    if (!applyTarget) return;
    try {
      await requestService.applyForRequest(applyTarget.id, dto);
      success('Отклик принят', `Вы назначены волонтёром на маршрут «${applyTarget.title}»`);
      setApplyTarget(null);
      const updated = await requestService.getRequests();
      setRequests(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка при отклике';
      error('Ошибка', msg);
    }
  };

  return (
    <div className={styles.landingWrapper}>
      {/* 1. HERO SECTION WITH INTERACTIVE TRANSIT RADAR MAP */}
      <section className={styles.heroSection} aria-labelledby="hero-title">
        <div className={`container ${styles.heroGrid}`}>
          {/* Hero Left Content */}
          <div className={styles.heroContent}>
            <div className={styles.serviceBadge}>
              <span className={styles.livePulseDot} aria-hidden="true" />
              <span>СЛУЖБА ГОРОДСКОГО СОПРОВОЖДЕНИЯ • БИШКЕК</span>
            </div>

            <h1 id="hero-title" className={styles.heroTitle}>
              Город доступнее, когда мы рядом.
            </h1>

            <p className={styles.heroLead}>
              Жолдош связывает маломобильных горожан, пожилых людей и людей с инвалидностью
              с проверенными волонтёрами Бишкека для безопасного сопровождения в медучреждения,
              ЦОНы и по важным делам.
            </p>

            <div className={styles.heroActions}>
              <Link href="/requests/new">
                <Button variant="primary" size="lg">
                  <span>Попросить о помощи</span>
                  <ArrowRightIcon size={18} />
                </Button>
              </Link>

              <Link href="/requests">
                <Button variant="outline" size="lg">
                  <span>Стать волонтёром</span>
                </Button>
              </Link>
            </div>

            {/* Quick Trust Highlights */}
            <div className={styles.trustBar}>
              <div className={styles.trustItem}>
                <strong>480+</strong>
                <span>сопровождений</span>
              </div>
              <div className={styles.trustDivider} aria-hidden="true" />
              <div className={styles.trustItem}>
                <strong>~18 мин</strong>
                <span>время отклика</span>
              </div>
              <div className={styles.trustDivider} aria-hidden="true" />
              <div className={styles.trustItem}>
                <div className={styles.trustRating}>
                  <StarIcon size={15} className={styles.starIcon} />
                  <strong>4.9 ★</strong>
                </div>
                <span>индекс доверия</span>
              </div>
            </div>
          </div>

          {/* Hero Right: Interactive Transit Route Canvas & Floating Cards */}
          <div className={styles.heroVisual} aria-label="Интерактивная карта сопровождения Бишкека">
            <div className={styles.mapCanvas}>
              {/* Stylized Bishkek Map Grid Background */}
              <svg className={styles.mapSvg} viewBox="0 0 540 420" fill="none">
                <defs>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#176B55" />
                    <stop offset="100%" stopColor="#21836A" />
                  </linearGradient>
                  <pattern id="gridPattern" width="36" height="36" patternUnits="userSpaceOnUse">
                    <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(23, 107, 85, 0.06)" strokeWidth="1" />
                  </pattern>
                </defs>

                {/* City Grid Texture */}
                <rect width="100%" height="100%" fill="url(#gridPattern)" />

                {/* Major Bishkek Avenues (stylized lines) */}
                <path d="M 20 180 L 520 180" stroke="#BCD8CB" strokeWidth="6" opacity="0.4" strokeLinecap="round" />
                <path d="M 20 300 L 520 300" stroke="#BCD8CB" strokeWidth="5" opacity="0.3" strokeLinecap="round" />
                <path d="M 180 20 L 180 400" stroke="#BCD8CB" strokeWidth="5" opacity="0.35" strokeLinecap="round" />
                <path d="M 360 20 L 360 400" stroke="#BCD8CB" strokeWidth="6" opacity="0.4" strokeLinecap="round" />

                {/* Active Transit Route Line (A -> B) */}
                <path
                  d="M 110 280 C 180 280, 220 220, 290 220 C 340 220, 360 140, 420 120"
                  stroke="url(#routeGradient)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  className={styles.animatedRouteLine}
                />

                {/* Traveling Volunteer Beacon moving smoothly along the route curve */}
                <circle r="12" fill="#176B55" opacity="0.25">
                  <animateMotion
                    path="M 110 280 C 180 280, 220 220, 290 220 C 340 220, 360 140, 420 120"
                    dur="5.5s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle r="5" fill="#176B55">
                  <animateMotion
                    path="M 110 280 C 180 280, 220 220, 290 220 C 340 220, 360 140, 420 120"
                    dur="5.5s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Waypoint A (Start Point: 7 мкр) */}
                <circle cx="110" cy="280" r="14" fill="#176B55" opacity="0.18" className={styles.pulseRing} />
                <circle cx="110" cy="280" r="7" fill="#176B55" />
                <circle cx="110" cy="280" r="3" fill="#ffffff" />

                {/* Waypoint B (Destination Point: ЦОН №2) */}
                <circle cx="420" cy="120" r="16" fill="#F0B86E" opacity="0.28" className={styles.pulseRingFast} />
                <circle cx="420" cy="120" r="8" fill="#F0B86E" />
                <circle cx="420" cy="120" r="3.5" fill="#613C08" />
              </svg>

              {/* Floating Card 1: Active Help Request (Top Left) */}
              <div className={styles.floatingCardTop}>
                <div className={styles.floatingCardHeader}>
                  <span className={styles.floatingBadgeUrgent}>Срочно · Сегодня 10:00</span>
                  <span className={styles.floatingDistance}>1.8 км</span>
                </div>
                <div className={styles.floatingRoute}>
                  <MapPinIcon size={16} className={styles.routePinIcon} />
                  <div>
                    <strong>7 мкр → ЦОН №2</strong>
                    <span>Сопровождение на коляске</span>
                  </div>
                </div>
                <div className={styles.floatingApplicant}>
                  <div className={styles.applicantAvatar}>А</div>
                  <span>Айгуль С. (заявитель)</span>
                </div>
              </div>

              {/* Floating Card 2: Volunteer En Route (Bottom Right) */}
              <div className={styles.floatingCardBottom}>
                <div className={styles.volunteerBanner}>
                  <div className={styles.volunteerAvatarWrap}>
                    <div className={styles.volunteerAvatar}>Б</div>
                    <span className={styles.onlineStatusDot} />
                  </div>
                  <div>
                    <div className={styles.volunteerNameRow}>
                      <strong>Бектур Асанов</strong>
                      <span className={styles.ratingPill}>★ 4.9</span>
                    </div>
                    <span className={styles.volunteerStatusText}>Волонтёр в пути • 8 мин</span>
                  </div>
                </div>
                <div className={styles.verifiedStrip}>
                  <ShieldCheckIcon size={14} className={styles.shieldIcon} />
                  <span>Проверен координатором платформы</span>
                </div>
              </div>

              {/* Bottom Route Status Pill */}
              <div className={styles.radarStatusPill}>
                <span className={styles.radarLiveLight} />
                <span>Бишкек: <strong>14 волонтёров</strong> готовы к выезду прямо сейчас</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE HUMAN TRANSIT JOURNEY (Маршрут → Человек → Помощь → Связь) */}
      <section
        ref={journeyReveal.ref}
        className={`${styles.journeySection} ${journeyReveal.isVisible ? styles.isRevealed : ''}`}
        aria-labelledby="journey-title"
      >
        <div className="container">
          <div className={styles.sectionHeaderCentered}>
            <div className={styles.sectionTag}>
              <KyrgyzMotifIcon size={16} className={styles.motifInline} />
              <span>ПРИНЦИП РАБОТЫ ПЛАТФОРМЫ</span>
            </div>
            <h2 id="journey-title" className={styles.sectionHeadingLarge}>
              Как Жолдош соединяет людей
            </h2>
            <p className={styles.sectionSubtext}>
              Простой и защищённый процесс организации сопровождения от заявки до возвращения домой.
            </p>
          </div>

          {/* Interactive Social Impact Route Bar */}
          <div className={styles.routeTrackerBar} role="tablist" aria-label="Этапы оказания помощи">
            <div className={styles.trackerLine}>
              <div
                className={styles.trackerProgress}
                style={{ width: `${(activeJourneyStep / (JOURNEY_STEPS.length - 1)) * 100}%` }}
              />
            </div>
            {JOURNEY_STEPS.map((s, idx) => {
              const isActive = activeJourneyStep === idx;
              const isPassed = activeJourneyStep >= idx;
              return (
                <button
                  key={s.step}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.trackerStepBtn} ${isActive ? styles.stepActive : ''} ${isPassed ? styles.stepPassed : ''}`}
                  onClick={() => setActiveJourneyStep(idx)}
                >
                  <span className={styles.trackerStepNode}>
                    {isPassed && idx < activeJourneyStep ? '✓' : s.step}
                  </span>
                  <span className={styles.trackerStepLabel}>{s.status}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.journeyGrid}>
            {JOURNEY_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isCurrent = activeJourneyStep === idx;
              return (
                <div
                  key={step.step}
                  className={`${styles.journeyCard} ${isCurrent ? styles.activeJourneyCard : ''}`}
                  onClick={() => setActiveJourneyStep(idx)}
                  style={{ animationDelay: `${0.1 + idx * 0.12}s` }}
                >
                  <div className={styles.journeyCardHeader}>
                    <span className={styles.journeyStepNumber}>{step.step}</span>
                    <span className={styles.journeyStatusBadge}>{step.status}</span>
                  </div>
                  <div className={styles.journeyIconBox}>
                    <Icon size={24} />
                  </div>
                  <h3 className={styles.journeyCardTitle}>{step.title}</h3>
                  <p className={styles.journeyCardText}>{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. DARK GREEN IMPACT & SOCIAL HOURS SECTION (#176B55) */}
      <section
        ref={impactReveal.ref}
        className={`${styles.impactSection} ${impactReveal.isVisible ? styles.isRevealed : ''}`}
        aria-labelledby="impact-title"
      >
        <div className={`container ${styles.impactContainer}`}>
          <div className={styles.impactHeader}>
            <div className={styles.impactBadge}>
              <SparklesIcon size={16} />
              <span>СОЦИАЛЬНЫЙ ВКЛАД И СИСТЕМА ПРИЗНАНИЯ</span>
            </div>
            <h2 id="impact-title" className={styles.impactTitle}>
              Каждый час заботы делает наш город добрее
            </h2>
            <p className={styles.impactLead}>
              Мы ценим каждого, кто дарит своё время. Система достижений и прозрачный учёт
              социальных часов превращают волонтёрство в осязаемую культуру взаимовыручки.
            </p>
          </div>

          {/* Social Stats + Achievement Showcase */}
          <div className={styles.impactContentGrid}>
            {/* Impact Metric Cards */}
            <div className={styles.statsCard}>
              <div className={styles.statMetric}>
                <span className={styles.statNumber}>18.5 ч</span>
                <span className={styles.statLabel}>Средний вклад волонтёра</span>
              </div>
              <div className={styles.statMetric}>
                <span className={styles.statNumber}>12</span>
                <span className={styles.statLabel}>Маршрутов в месяц на волонтёра</span>
              </div>
              <div className={styles.statMetric}>
                <span className={styles.statNumber}>98%</span>
                <span className={styles.statLabel}>Доверие подопечных и семей</span>
              </div>
              <div className={styles.statMetric}>
                <span className={styles.statNumber}>4.9 ★</span>
                <span className={styles.statLabel}>Средняя оценка сопровождения</span>
              </div>
            </div>

            {/* Achievements Preview Card */}
            <div className={styles.achievementsPreviewCard}>
              <div className={styles.achievementsCardHeader}>
                <AwardIcon size={22} className={styles.awardIcon} />
                <div>
                  <h3>Награды и достижения волонтёров</h3>
                  <span>Система признания социальной активности в Бишкеке</span>
                </div>
              </div>

              <div className={styles.badgesList}>
                <div className={styles.badgeItemUnlocked}>
                  <div className={styles.badgeIcon}>🏆</div>
                  <div>
                    <strong>Первые 5 поездок</strong>
                    <span>Успешный старт в рядах службы</span>
                  </div>
                </div>

                <div className={styles.badgeItemUnlocked}>
                  <div className={styles.badgeIcon}>🤝</div>
                  <div>
                    <strong>Надёжный попутчик</strong>
                    <span>100% маршрутов завершены вовремя</span>
                  </div>
                </div>

                <div className={styles.badgeItemUnlocked}>
                  <div className={styles.badgeIcon}>💚</div>
                  <div>
                    <strong>10 часов помощи</strong>
                    <span>Существенный социальный вклад</span>
                  </div>
                </div>

                <div className={styles.badgeItemLocked}>
                  <div className={styles.badgeIcon}>🚀</div>
                  <div>
                    <strong>25 сопровождений (12 / 25)</strong>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: '48%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/volunteer" className={styles.viewCabinetLink}>
                <span>Перейти в кабинет волонтёра →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SPHERES OF SUPPORT (Направления помощи) */}
      <section
        ref={spheresReveal.ref}
        className={`${styles.spheresSection} ${spheresReveal.isVisible ? styles.isRevealed : ''}`}
        aria-labelledby="spheres-title"
      >
        <div className="container">
          <div className={styles.sectionHeaderRow}>
            <div>
              <div className={styles.sectionTag}>
                <span>НАПРАВЛЕНИЯ РАБОТЫ</span>
              </div>
              <h2 id="spheres-title" className={styles.sectionHeadingLarge}>
                Какая помощь оказывается через платформу
              </h2>
            </div>
            <Link href="/requests/new">
              <Button variant="ghost">
                <span>Оставить заявку по любому направлению →</span>
              </Button>
            </Link>
          </div>

          <div className={styles.spheresGrid}>
            <article className={styles.sphereCard}>
              <div className={styles.sphereIconWrap}>
                <FirstAidIcon size={24} />
              </div>
              <span className={styles.sphereIndex}>01</span>
              <h3 className={styles.sphereTitle}>Сопровождение в медучреждения</h3>
              <p className={styles.sphereText}>
                Помощь маломобильным гражданам добраться до поликлиники, больницы или
                реабилитационного центра с поддержкой при спуске и подъёме.
              </p>
            </article>

            <article className={styles.sphereCard}>
              <div className={styles.sphereIconWrap}>
                <HeartHandshakeIcon size={24} />
              </div>
              <span className={styles.sphereIndex}>02</span>
              <h3 className={styles.sphereTitle}>Доставка медикаментов и питания</h3>
              <p className={styles.sphereText}>
                Приобретение рецептурных лекарств в аптеках, базовых продуктов питания и подъём
                на этаж при неработающем лифте.
              </p>
            </article>

            <article className={styles.sphereCard}>
              <div className={styles.sphereIconWrap}>
                <CarIcon size={24} />
              </div>
              <span className={styles.sphereIndex}>03</span>
              <h3 className={styles.sphereTitle}>Автоволонтёрство</h3>
              <p className={styles.sphereText}>
                Волонтёры на личном транспорте для поездок в ЦОН, банк или больницу, когда
                общественный транспорт недоступен для коляски или костылей.
              </p>
            </article>

            <article className={styles.sphereCard}>
              <div className={styles.sphereIconWrap}>
                <SparklesIcon size={24} />
              </div>
              <span className={styles.sphereIndex}>04</span>
              <h3 className={styles.sphereTitle}>Бытовая и цифровая помощь</h3>
              <p className={styles.sphereText}>
                Помощь пожилым людям с получением справок через «Түндүк», настройка связи с
                родственниками и базовый бытовой уход.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 5. REAL OPEN REQUESTS DIRECTORY */}
      <section
        ref={directoryReveal.ref}
        className={`${styles.directorySection} ${directoryReveal.isVisible ? styles.isRevealed : ''}`}
        aria-labelledby="live-requests-title"
      >
        <div className="container">
          <div className={styles.feedHeaderRow}>
            <div>
              <div className={styles.sectionTag}>
                <span>ОПЕРАТИВНЫЙ РЕЕСТР</span>
              </div>
              <h2 id="live-requests-title" className={styles.sectionHeadingLarge}>
                Маршруты, ожидающие отклика волонтёра
              </h2>
              <p className={styles.sectionSubtext}>
                Любой житель Бишкека может принять открытую заявку и помочь человеку рядом.
              </p>
            </div>

            <Link href="/requests">
              <Button variant="outline">
                <span>Смотреть весь реестр заявок →</span>
              </Button>
            </Link>
          </div>

          <div className={styles.requestsDirectoryGrid}>
            {openRequests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                onApply={(r) => setApplyTarget(r)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. TRUST & SAFETY / COORDINATOR HEADQUARTERS STRIP */}
      <section
        ref={trustReveal.ref}
        className={`${styles.trustSection} ${trustReveal.isVisible ? styles.isRevealed : ''}`}
        aria-labelledby="trust-title"
      >
        <div className="container">
          <div className={styles.civicNotice}>
            <div className={styles.noticeContent}>
              <div className={styles.noticeBadge}>
                <ShieldCheckIcon size={18} />
                <span>БЕЗОПАСНОСТЬ И ВЕРИФИКАЦИЯ</span>
              </div>
              <h3 id="trust-title">Координационный штаб платформы «Жолдош»</h3>
              <p>
                Каждая заявка модерируется. Если вы представитель социальной службы, опеки
                или вам требуется экстренная консультация по сопровождению подопечного,
                свяжитесь с дежурным координатором Бишкека.
              </p>
            </div>

            <div className={styles.noticeContact}>
              <PhoneIcon size={24} className={styles.phoneIcon} />
              <div>
                <span>Горячая линия координатора:</span>
                <strong>+996 (312) 900-112</strong>
                <span>Бишкек, ул. Киевская 96 • Ежедневно с 08:00 до 20:00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apply Modal */}
      <VolunteerApplyModal
        request={applyTarget}
        isOpen={Boolean(applyTarget)}
        onClose={() => setApplyTarget(null)}
        onConfirm={handleApplyConfirm}
      />
    </div>
  );
}
