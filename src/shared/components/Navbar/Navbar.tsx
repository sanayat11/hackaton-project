'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.scss';
import { RoleSwitcher } from '@/modules/auth/components/RoleSwitcher';
import { KyrgyzMotifIcon, ArrowRightIcon } from '@/shared/components/Icons';

const NAV_ITEMS = [
  { href: '/', label: 'Главная' },
  { href: '/requests', label: 'Лента заявок' },
  { href: '/volunteer', label: 'Кабинет волонтёра' },
  { href: '/coordinator', label: 'Координация' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <a href="#main-content" className="skip-link">
        Перейти к основному содержимому
      </a>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.brand} aria-label="JoCare — платформа сопровождения">
          <div className={styles.brandMarkWrapper}>
            <div className={styles.motifBadge}>
              <KyrgyzMotifIcon size={20} className={styles.motifIcon} />
            </div>
            <div className={styles.transitDots}>
              <span className={styles.dotPulse} />
            </div>
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>JoCare</span>
            <span className={styles.brandSubtitle}>Служба городского сопровождения</span>
          </div>
        </Link>

        <nav className={styles.navLinks} aria-label="Основная навигация">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.rightSection}>
          <RoleSwitcher />

          <Link href="/requests/new" className={styles.quickCtaBtn}>
            <span>Подать заявку</span>
            <ArrowRightIcon size={15} />
          </Link>

          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Закрыть навигационное меню' : 'Открыть навигационное меню'}
          >
            {isMobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className={styles.mobileDrawer} role="dialog" aria-label="Мобильное меню">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`${styles.mobileLink} ${isActive ? styles.active : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <div className={styles.mobileRoleSection}>
            <span className={styles.mobileRoleTitle}>Переключение роли пользователя</span>
            <RoleSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
