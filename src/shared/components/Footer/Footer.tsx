// src/shared/components/Footer/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.scss';
import { useNotification } from '@/modules/notifications/notificationContext';

export function Footer() {
  const { success } = useNotification();

  const handleResetData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('joldosh_requests_store');
      localStorage.removeItem('joldosh_current_role');
      success('Данные сброшены', 'Восстановлен исходный набор демонстрационных заявок.');
      setTimeout(() => {
        window.location.reload();
      }, 600);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brandCol}>
          <span className={styles.serviceRef}>JOCARE • КЫРГЫЗСТАН</span>
          <span className={styles.brandTitle}>Служба взаимной поддержки и сопровождения</span>
          <p className={styles.brandDesc}>
            Платформа объединяет горожан, готовых сопровождать маломобильных граждан в
            поликлиники, доставлять медикаменты и оказывать бытовую помощь в Бишкеке.
          </p>
        </div>

        <div>
          <h3 className={styles.colTitle}>Разделы системы</h3>
          <ul className={styles.linkList}>
            <li>
              <Link href="/requests" className={styles.link}>
                Реестр открытых заявок
              </Link>
            </li>
            <li>
              <Link href="/requests/new" className={styles.link}>
                Подать новую заявку
              </Link>
            </li>
            <li>
              <Link href="/volunteer" className={styles.link}>
                Кабинет волонтёра
              </Link>
            </li>
            <li>
              <Link href="/coordinator" className={styles.link}>
                Диспетчерский пульт
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className={styles.colTitle}>Связь с координатором</h3>
          <ul className={styles.linkList}>
            <li className={styles.link}>Телефон: +996 (312) 900-112</li>
            <li className={styles.link}>Диспетчер: @jocare_dispatch_kg</li>
            <li className={styles.link}>Бишкек, Первомайский район</li>
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottomBar}`}>
        <span>© 2026 JoCare. Гражданская инициатива взаимной помощи.</span>
        <button
          type="button"
          onClick={handleResetData}
          className={styles.resetBtn}
          title="Сбросить локальное хранилище и восстановить исходные тестовые данные"
        >
          [Сбросить данные LocalStorage]
        </button>
      </div>
    </footer>
  );
}
