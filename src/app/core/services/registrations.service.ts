// src/app/core/services/registrations.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Registration } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class RegistrationsService {
  private url = `${environment.apiUrl}/registrations`;

  constructor(private http: HttpClient) {}

  register(eventId: number) {
    return this.http.post<Registration>(`${this.url}/events/${eventId}`, {});
  }

  cancel(eventId: number) {
    return this.http.delete(`${this.url}/events/${eventId}`);
  }

  getMyRegistrations() {
    return this.http.get<Registration[]>(`${this.url}/my`);
  }
}
