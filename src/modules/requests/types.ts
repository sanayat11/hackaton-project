// src/modules/requests/types.ts

export type RequestStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type UrgencyLevel = 'low' | 'medium' | 'high';

export type RequestCategory =
  | 'delivery'
  | 'social'
  | 'auto'
  | 'repair'
  | 'education'
  | 'emergency';

export interface IRequest {
  id: string;
  title: string;
  description: string;
  category: RequestCategory;
  urgency: UrgencyLevel;
  address: string;
  district: string;
  contactName: string;
  contactPhone: string;
  preferredTime: string;
  status: RequestStatus;
  createdAt: string;
  applicantId: string;
  applicantName: string;
  
  // Volunteer & workflow tracking
  volunteerId?: string;
  volunteerName?: string;
  volunteerPhone?: string;
  assignedAt?: string;
  inProgressAt?: string;
  completedAt?: string;
  completionNotes?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export interface CreateRequestDTO {
  title: string;
  description: string;
  category: RequestCategory;
  urgency: UrgencyLevel;
  address: string;
  district: string;
  contactName: string;
  contactPhone: string;
  preferredTime: string;
}

export interface ApplyRequestDTO {
  volunteerId: string;
  volunteerName: string;
  volunteerPhone: string;
  message?: string;
}

export interface CompleteRequestDTO {
  completionNotes?: string;
}

export interface CancelRequestDTO {
  reason: string;
}

export interface AssignRequestDTO {
  volunteerId: string;
  volunteerName: string;
  volunteerPhone: string;
}

export interface RequestFiltersState {
  searchQuery: string;
  category: RequestCategory | 'all';
  urgency: UrgencyLevel | 'all';
  status: RequestStatus | 'all';
  sortBy: 'date_desc' | 'date_asc' | 'urgency_desc';
}
