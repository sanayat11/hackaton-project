// src/app/requests/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { IRequest } from '@/modules/requests/types';
import { requestService } from '@/modules/requests/api/requestService';
import { RequestDetailView } from '@/modules/requests/components/RequestDetailView/RequestDetailView';
import { Button } from '@/shared/components/Button/Button';

export default function RequestDetailPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';

  const [request, setRequest] = useState<IRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    requestService
      .getRequestById(id)
      .then((data) => {
        setRequest(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center', color: '#176B55' }}>
        Загрузка данных заявки...
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.75rem', color: '#176B55', marginBottom: '1rem' }}>
          Заявка не найдена
        </h1>
        <p style={{ color: '#536A5F', marginBottom: '1.5rem' }}>
          Заявка с номером «{id}» не существует или была удалена.
        </p>
        <Link href="/requests">
          <Button variant="primary">Вернуться к списку заявок</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
      <RequestDetailView initialRequest={request} />
    </div>
  );
}
