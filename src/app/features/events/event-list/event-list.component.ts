// src/app/features/events/event-list/event-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventsService } from '../../../core/services/events.service';
import { AuthService } from '../../../core/services/auth.service';
import { Event } from '../../../shared/models';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  loading = true;
  error = '';
  selectedCategory = '';
  selectedStatus = '';
  categories = ['Seminario', 'Taller', 'Conferencia', 'Hackathon', 'Otro'];
  statuses = [
    { value: '', label: 'Todos los estados' },
    { value: 'UPCOMING', label: 'Próximos' },
    { value: 'ONGOING', label: 'En curso' },
    { value: 'FINISHED', label: 'Finalizados' },
    { value: 'CANCELLED', label: 'Cancelados' },
  ];

  constructor(public eventsService: EventsService, public authService: AuthService) {}

  ngOnInit() { this.loadEvents(); }

  loadEvents() {
    this.loading = true;
    this.eventsService.getAll(this.selectedCategory, this.selectedStatus).subscribe({
      next: (events) => { this.events = events; this.loading = false; },
      error: () => { this.error = 'No se pudieron cargar los eventos'; this.loading = false; },
    });
  }

  onFilter() { this.loadEvents(); }
  clearFilters() { this.selectedCategory = ''; this.selectedStatus = ''; this.loadEvents(); }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = { UPCOMING: 'Próximo', ONGOING: 'En curso', FINISHED: 'Finalizado', CANCELLED: 'Cancelado' };
    return map[status] || status;
  }

  getCategoryEmoji(category: string): string {
    const map: Record<string, string> = { Seminario: '🎤', Taller: '🔧', Conferencia: '📊', Hackathon: '💻', Otro: '📌' };
    return map[category] || '📌';
  }
}
