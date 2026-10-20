// src/modules/requests/api/mockAdapter.ts
import {
  IRequest,
  CreateRequestDTO,
  ApplyRequestDTO,
  CompleteRequestDTO,
  CancelRequestDTO,
  AssignRequestDTO,
  RequestFiltersState,
} from '../types';
import { INITIAL_MOCK_REQUESTS } from './mockData';

const STORAGE_KEY = 'joldosh_requests_store';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getStoredRequests(): IRequest[] {
  if (typeof window === 'undefined') {
    return [...INITIAL_MOCK_REQUESTS];
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_REQUESTS));
    return [...INITIAL_MOCK_REQUESTS];
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to parse stored requests, resetting to initial', e);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_REQUESTS));
  return [...INITIAL_MOCK_REQUESTS];
}

function saveStoredRequests(requests: IRequest[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }
}

export const mockRequestAdapter = {
  isDemoAdapter: true,

  async getAllRequests(filters?: Partial<RequestFiltersState>): Promise<IRequest[]> {
    await delay(180);
    let items = getStoredRequests();

    if (!filters) return items;

    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.toLowerCase().trim();
      items = items.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.address.toLowerCase().includes(q) ||
          r.district.toLowerCase().includes(q)
      );
    }

    if (filters.category && filters.category !== 'all') {
      items = items.filter((r) => r.category === filters.category);
    }

    if (filters.urgency && filters.urgency !== 'all') {
      items = items.filter((r) => r.urgency === filters.urgency);
    }

    if (filters.status && filters.status !== 'all') {
      items = items.filter((r) => r.status === filters.status);
    }

    if (filters.sortBy) {
      items = [...items].sort((a, b) => {
        if (filters.sortBy === 'date_desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (filters.sortBy === 'date_asc') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (filters.sortBy === 'urgency_desc') {
          const rank = { high: 3, medium: 2, low: 1 };
          return rank[b.urgency] - rank[a.urgency];
        }
        return 0;
      });
    }

    return items;
  },

  async getRequestById(id: string): Promise<IRequest | null> {
    await delay(150);
    const items = getStoredRequests();
    const found = items.find((r) => r.id === id);
    return found ? { ...found } : null;
  },

  async createRequest(dto: CreateRequestDTO, applicantId: string): Promise<IRequest> {
    await delay(300);
    const items = getStoredRequests();
    const newRequest: IRequest = {
      id: `req-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      title: dto.title.trim(),
      description: dto.description.trim(),
      category: dto.category,
      urgency: dto.urgency,
      address: dto.address.trim(),
      district: dto.district,
      contactName: dto.contactName.trim(),
      contactPhone: dto.contactPhone.trim(),
      preferredTime: dto.preferredTime.trim(),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      applicantId,
      applicantName: dto.contactName.trim(),
    };

    items.unshift(newRequest);
    saveStoredRequests(items);
    return newRequest;
  },

  async applyForRequest(id: string, dto: ApplyRequestDTO): Promise<IRequest> {
    await delay(320);
    const items = getStoredRequests();
    const index = items.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Заявка с ID "${id}" не найдена`);
    }

    const current = items[index];
    if (current.status !== 'PENDING') {
      throw new Error('На данную заявку уже назначен волонтёр или она завершена');
    }

    const updated: IRequest = {
      ...current,
      status: 'ASSIGNED',
      volunteerId: dto.volunteerId,
      volunteerName: dto.volunteerName,
      volunteerPhone: dto.volunteerPhone,
      assignedAt: new Date().toISOString(),
    };

    items[index] = updated;
    saveStoredRequests(items);
    return updated;
  },

  async assignVolunteer(id: string, dto: AssignRequestDTO): Promise<IRequest> {
    await delay(300);
    const items = getStoredRequests();
    const index = items.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Заявка с ID "${id}" не найдена`);
    }

    const updated: IRequest = {
      ...items[index],
      status: 'ASSIGNED',
      volunteerId: dto.volunteerId,
      volunteerName: dto.volunteerName,
      volunteerPhone: dto.volunteerPhone,
      assignedAt: new Date().toISOString(),
    };

    items[index] = updated;
    saveStoredRequests(items);
    return updated;
  },

  async startProgress(id: string): Promise<IRequest> {
    await delay(250);
    const items = getStoredRequests();
    const index = items.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Заявка с ID "${id}" не найдена`);
    }

    const updated: IRequest = {
      ...items[index],
      status: 'IN_PROGRESS',
      inProgressAt: new Date().toISOString(),
    };

    items[index] = updated;
    saveStoredRequests(items);
    return updated;
  },

  async completeRequest(id: string, dto: CompleteRequestDTO): Promise<IRequest> {
    await delay(320);
    const items = getStoredRequests();
    const index = items.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Заявка с ID "${id}" не найдена`);
    }

    const current = items[index];
    if (current.status === 'COMPLETED' || current.status === 'CANCELLED') {
      throw new Error('Данная заявка уже закрыта');
    }

    const updated: IRequest = {
      ...current,
      status: 'COMPLETED',
      completedAt: new Date().toISOString(),
      completionNotes: dto.completionNotes?.trim() || undefined,
    };

    items[index] = updated;
    saveStoredRequests(items);
    return updated;
  },

  async cancelRequest(id: string, dto: CancelRequestDTO): Promise<IRequest> {
    await delay(300);
    const items = getStoredRequests();
    const index = items.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Заявка с ID "${id}" не найдена`);
    }

    const current = items[index];
    if (current.status === 'COMPLETED') {
      throw new Error('Нельзя отменить уже завершенную заявку');
    }

    const updated: IRequest = {
      ...current,
      status: 'CANCELLED',
      cancelledAt: new Date().toISOString(),
      cancellationReason: dto.reason.trim(),
    };

    items[index] = updated;
    saveStoredRequests(items);
    return updated;
  },

  async resetToInitial(): Promise<void> {
    await delay(150);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_REQUESTS));
    }
  },
};
