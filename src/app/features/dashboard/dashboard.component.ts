// src/app/features/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RegistrationsService } from '../../core/services/registrations.service';
import { Registration } from '../../shared/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  registrations: Registration[] = [];
  loading = true;

  constructor(
    public authService: AuthService,
    private registrationsService: RegistrationsService,
  ) {}

  ngOnInit() {
    this.registrationsService.getMyRegistrations().subscribe({
      next: (regs) => { this.registrations = regs; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  cancelRegistration(eventId: number) {
    if (!confirm('¿Cancelar inscripción?')) return;
    this.registrationsService.cancel(eventId).subscribe({
      next: () => {
        this.registrations = this.registrations.filter((r) => r.eventId !== eventId);
      },
    });
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      UPCOMING: 'Próximo', ONGOING: 'En curso', FINISHED: 'Finalizado', CANCELLED: 'Cancelado',
    };
    return map[status] || status;
  }
}
