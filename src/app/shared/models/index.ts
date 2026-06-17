// src/app/shared/models/index.ts

export type Role = 'ADMIN' | 'PARTICIPANT';
export type UserType = 'STUDENT' | 'TEACHER';
export type EventStatus = 'UPCOMING' | 'ONGOING' | 'FINISHED' | 'CANCELLED';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  userType?: UserType;
  createdAt: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  capacity: number;
  status: EventStatus;
  category: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  _count?: { registrations: number };
  registrations?: Registration[];
}

export interface Registration {
  id: number;
  userId: number;
  eventId: number;
  registeredAt: string;
  attended: boolean;
  event?: Event;
  user?: User;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface Notification {
  id: string;
  eventId: number;
  eventTitle: string;
  message: string;
  type: 'date_change' | 'location_change' | 'cancellation' | 'general';
  read: boolean;
  createdAt: string;
}

export interface Stats {
  totalEvents: number;
  totalUsers: number;
  totalRegistrations: number;
  upcomingEvents: number;
  eventsByCategory: { category: string; _count: number }[];
}
