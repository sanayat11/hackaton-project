// src/app/volunteer/page.tsx
import { VolunteerCabinet } from '@/modules/volunteer/components/VolunteerCabinet/VolunteerCabinet';

export const metadata = {
  title: 'Кабинет волонтёра • JoCare',
  description: 'Управление назначенными задачами и статистика добрых дел волонтёра.',
};

export default function VolunteerPage() {
  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
      <VolunteerCabinet />
    </div>
  );
}
