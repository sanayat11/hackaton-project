// src/app/layout.tsx
import type { Metadata } from 'next';
import '@/styles/globals.scss';
import { AuthProvider } from '@/modules/auth/authContext';
import { NotificationProvider } from '@/modules/notifications/notificationContext';
import { Navbar } from '@/shared/components/Navbar/Navbar';
import { Footer } from '@/shared/components/Footer/Footer';
import { ToastContainer } from '@/modules/notifications/components/ToastContainer';

export const metadata: Metadata = {
  title: 'Жолдош — Платформа взаимопомощи и волонтёрства',
  description:
    'Цифровая система координации волонтёрской помощи в Кыргызстане: доставка медикаментов и продуктов, автопомощь, уход за пожилыми и экстренная поддержка.',
  keywords: ['волонтёрство', 'Бишкек', 'Кыргызстан', 'взаимопомощь', 'Жолдош', 'социальная помощь'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <NotificationProvider>
          <AuthProvider>
            <Navbar />
            <main id="main-content">{children}</main>
            <Footer />
            <ToastContainer />
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
