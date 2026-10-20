// src/app/requests/page.tsx
import { RequestFeed } from '@/modules/requests/components/RequestFeed/RequestFeed';

export const metadata = {
  title: 'Лента заявок • JoCare',
  description: 'Список всех активных заявок на помощь от жителей Кыргызстана.',
};

export default function RequestsPage() {
  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
      <RequestFeed />
    </div>
  );
}
