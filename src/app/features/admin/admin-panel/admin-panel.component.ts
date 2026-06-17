// src/app/features/admin/admin-panel/admin-panel.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EventsService } from '../../../core/services/events.service';
import { NotificationsService } from '../../../core/services/notifications.service';
import { Stats, Event, User } from '../../../shared/models';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  stats: Stats | null = null;
  events: Event[] = [];
  users: User[] = [];
  loading = true;
  activeTab = signal<'events' | 'users' | 'notifications'>('events');
  showNotifForm = signal(false);
  selectedEvent = signal<Event | null>(null);

  notifForm = this.fb.group({
    type: ['date_change', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  constructor(
    private eventsService: EventsService,
    public notifService: NotificationsService,
    private http: HttpClient,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.eventsService.getStats().subscribe({ next: (s) => { this.stats = s; } });
    this.eventsService.getAll().subscribe({ next: (e) => { this.events = e; this.loading = false; } });
    this.http.get<User[]>(`${environment.apiUrl}/users`).subscribe({ next: (u) => { this.users = u; } });
  }

  deleteEvent(id: number) {
    if (!confirm('¿Eliminar este evento?')) return;
    this.eventsService.delete(id).subscribe({ next: () => { this.events = this.events.filter(e => e.id !== id); } });
  }

  getUserTypeLabel(user: any): string {
    if (user.role === 'ADMIN') return 'Admin';
    return user.userType === 'TEACHER' ? 'Docente' : 'Estudiante';
  }

  openNotifForm(event: Event) {
    this.selectedEvent.set(event);
    this.showNotifForm.set(true);
    this.notifForm.reset({ type: 'date_change', message: '' });
  }

  sendNotification() {
    if (this.notifForm.invalid || !this.selectedEvent()) return;
    const event = this.selectedEvent()!;
    const { type, message } = this.notifForm.value;
    this.notifService.add({
      eventId: event.id,
      eventTitle: event.title,
      message: message!,
      type: type as any,
    });
    this.showNotifForm.set(false);
    alert(`Notificación enviada a todos los participantes del evento "${event.title}"`);
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = { UPCOMING: 'Próximo', ONGOING: 'En curso', FINISHED: 'Finalizado', CANCELLED: 'Cancelado' };
    return map[status] || status;
  }
}
