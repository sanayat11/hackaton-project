// src/app/requests/new/page.tsx
import { CreateRequestForm } from '@/modules/requests/components/CreateRequestForm/CreateRequestForm';

export const metadata = {
  title: 'Подать новую заявку • Жолдош',
  description: 'Создание заявки на волонтёрскую помощь в Бишкеке и пригороде.',
};

export default function NewRequestPage() {
  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
      <CreateRequestForm />
    </div>
  );
}
