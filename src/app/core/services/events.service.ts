// src/app/core/services/events.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Event, Stats } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private url = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  getAll(category?: string, status?: string) {
    let params = new HttpParams();
    if (category) params = params.set('category', category);
    if (status) params = params.set('status', status);
    return this.http.get<Event[]>(this.url, { params });
  }

  getOne(id: number) {
    return this.http.get<Event>(`${this.url}/${id}`);
  }

  create(data: Partial<Event>) {
    return this.http.post<Event>(this.url, data);
  }

  update(id: number, data: Partial<Event>) {
    return this.http.put<Event>(`${this.url}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  getStats() {
    return this.http.get<Stats>(`${this.url}/stats`);
  }

  getAvailableSpots(event: Event): number {
    return event.capacity - (event._count?.registrations ?? 0);
  }
}
