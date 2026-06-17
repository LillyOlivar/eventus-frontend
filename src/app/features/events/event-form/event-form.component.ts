// src/app/features/events/event-form/event-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventsService } from '../../../core/services/events.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css'],
})
export class EventFormComponent implements OnInit {
  isEdit = false;
  eventId: number | null = null;
  loading = false;
  loadingData = false;
  error = '';
  categories = ['Seminario', 'Taller', 'Conferencia', 'Hackathon', 'Otro'];
  statuses = ['UPCOMING', 'ONGOING', 'FINISHED', 'CANCELLED'];

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    location: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    capacity: [1, [Validators.required, Validators.min(1)]],
    category: ['Seminario', [Validators.required]],
    imageUrl: [''],
    status: ['UPCOMING'],
  });

  constructor(
    private fb: FormBuilder,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.eventId = Number(id);
      this.loadEvent();
    }
  }

  loadEvent() {
    this.loadingData = true;
    this.eventsService.getOne(this.eventId!).subscribe({
      next: (event) => {
        this.form.patchValue({
          ...event,
          startDate: this.toDatetimeLocal(event.startDate),
          endDate: this.toDatetimeLocal(event.endDate),
        });
        this.loadingData = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el evento';
        this.loadingData = false;
      },
    });
  }

  private toDatetimeLocal(dateStr: string): string {
    return new Date(dateStr).toISOString().slice(0, 16);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    const data = this.form.value as any;

    const obs = this.isEdit
      ? this.eventsService.update(this.eventId!, data)
      : this.eventsService.create(data);

    obs.subscribe({
      next: (event) => this.router.navigate(['/events', event.id]),
      error: (err) => {
        this.error = Array.isArray(err.error?.message)
          ? err.error.message.join(', ')
          : (err.error?.message || 'Error al guardar el evento');
        this.loading = false;
      },
    });
  }
}
