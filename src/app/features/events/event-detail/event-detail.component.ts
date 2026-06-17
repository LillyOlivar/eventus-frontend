// src/app/features/events/event-detail/event-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventsService } from '../../../core/services/events.service';
import { RegistrationsService } from '../../../core/services/registrations.service';
import { AuthService } from '../../../core/services/auth.service';
import { Event } from '../../../shared/models';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  loading = true;
  error = '';
  actionLoading = false;
  actionMessage = '';
  isRegistered = false;
  myRegistrations: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public eventsService: EventsService,
    private registrationsService: RegistrationsService,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEvent(id);
    if (this.authService.isLoggedIn()) {
      this.loadMyRegistrations();
    }
  }

  loadEvent(id: number) {
    this.eventsService.getOne(id).subscribe({
      next: (event) => {
        this.event = event;
        this.loading = false;
        this.checkRegistration();
      },
      error: () => {
        this.error = 'Evento no encontrado';
        this.loading = false;
      },
    });
  }

  loadMyRegistrations() {
    this.registrationsService.getMyRegistrations().subscribe({
      next: (regs) => {
        this.myRegistrations = regs.map((r) => r.eventId);
        this.checkRegistration();
      },
    });
  }

  checkRegistration() {
    if (this.event) {
      this.isRegistered = this.myRegistrations.includes(this.event.id);
    }
  }

  register() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.actionLoading = true;
    this.registrationsService.register(this.event!.id).subscribe({
      next: () => {
        this.isRegistered = true;
        this.actionMessage = '¡Inscripción exitosa!';
        this.actionLoading = false;
        this.loadEvent(this.event!.id);
      },
      error: (err) => {
        this.actionMessage = err.error?.message || 'Error al inscribirse';
        this.actionLoading = false;
      },
    });
  }

  cancel() {
    this.actionLoading = true;
    this.registrationsService.cancel(this.event!.id).subscribe({
      next: () => {
        this.isRegistered = false;
        this.actionMessage = 'Inscripción cancelada';
        this.actionLoading = false;
        this.loadEvent(this.event!.id);
      },
      error: (err) => {
        this.actionMessage = err.error?.message || 'Error al cancelar';
        this.actionLoading = false;
      },
    });
  }

  deleteEvent() {
    if (!confirm('¿Seguro que deseas eliminar este evento?')) return;
    this.eventsService.delete(this.event!.id).subscribe({
      next: () => this.router.navigate(['/events']),
      error: () => (this.actionMessage = 'Error al eliminar el evento'),
    });
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      UPCOMING: 'Próximo', ONGOING: 'En curso',
      FINISHED: 'Finalizado', CANCELLED: 'Cancelado',
    };
    return map[status] || status;
  }

  canRegister(): boolean {
    if (!this.event) return false;
    return (
      this.event.status === 'UPCOMING' &&
      this.eventsService.getAvailableSpots(this.event) > 0 &&
      !this.isRegistered
    );
  }
}
