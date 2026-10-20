// src/app/coordinator/page.tsx
import { CoordinatorDashboard } from '@/modules/coordinator/components/CoordinatorDashboard/CoordinatorDashboard';

export const metadata = {
  title: 'Панель координатора • Жолдош',
  description: 'Координационный штаб платформы взаимопомощи Жолдош.',
};

export default function CoordinatorPage() {
  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
      <CoordinatorDashboard />
    </div>
  );
}
