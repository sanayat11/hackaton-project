// src/modules/requests/api/requestService.ts
import { mockRequestAdapter } from './mockAdapter';
import {
  IRequest,
  CreateRequestDTO,
  ApplyRequestDTO,
  CompleteRequestDTO,
  CancelRequestDTO,
  AssignRequestDTO,
  RequestFiltersState,
} from '../types';

const USE_REAL_API = process.env.NEXT_PUBLIC_USE_REAL_API === 'true';

export const requestService = {
  isDemoMode: !USE_REAL_API,
  storageDescription: USE_REAL_API
    ? 'Удалённый Backend REST API'
    : 'Локальный демонстрационный адаптер (Браузерное хранилище LocalStorage)',

  async getRequests(filters?: Partial<RequestFiltersState>): Promise<IRequest[]> {
    if (!USE_REAL_API) {
      return mockRequestAdapter.getAllRequests(filters);
    }
    // Real API fallback if configured
    const res = await fetch('/api/requests');
    if (!res.ok) throw new Error('Ошибка загрузки заявок с сервера');
    return res.json();
  },

  async getRequestById(id: string): Promise<IRequest | null> {
    if (!USE_REAL_API) {
      return mockRequestAdapter.getRequestById(id);
    }
    const res = await fetch(`/api/requests/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Ошибка загрузки заявки');
    return res.json();
  },

  async createRequest(dto: CreateRequestDTO, applicantId: string): Promise<IRequest> {
    if (!USE_REAL_API) {
      return mockRequestAdapter.createRequest(dto, applicantId);
    }
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...dto, applicantId }),
    });
    if (!res.ok) throw new Error('Не удалось создать заявку на сервере');
    return res.json();
  },

  async applyForRequest(id: string, dto: ApplyRequestDTO): Promise<IRequest> {
    if (!USE_REAL_API) {
      return mockRequestAdapter.applyForRequest(id, dto);
    }
    const res = await fetch(`/api/requests/${id}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error('Не удалось откликнуться на сервере');
    return res.json();
  },

  async assignVolunteer(id: string, dto: AssignRequestDTO): Promise<IRequest> {
    if (!USE_REAL_API) {
      return mockRequestAdapter.assignVolunteer(id, dto);
    }
    const res = await fetch(`/api/requests/${id}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error('Не удалось назначить волонтёра на сервере');
    return res.json();
  },

  async startProgress(id: string): Promise<IRequest> {
    if (!USE_REAL_API) {
      return mockRequestAdapter.startProgress(id);
    }
    const res = await fetch(`/api/requests/${id}/start`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Не удалось обновить статус на сервере');
    return res.json();
  },

  async completeRequest(id: string, dto: CompleteRequestDTO): Promise<IRequest> {
    if (!USE_REAL_API) {
      return mockRequestAdapter.completeRequest(id, dto);
    }
    const res = await fetch(`/api/requests/${id}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error('Не удалось завершить заявку на сервере');
    return res.json();
  },

  async cancelRequest(id: string, dto: CancelRequestDTO): Promise<IRequest> {
    if (!USE_REAL_API) {
      return mockRequestAdapter.cancelRequest(id, dto);
    }
    const res = await fetch(`/api/requests/${id}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error('Не удалось отменить заявку на сервере');
    return res.json();
  },

  async resetData(): Promise<void> {
    if (!USE_REAL_API) {
      return mockRequestAdapter.resetToInitial();
    }
  },
};
