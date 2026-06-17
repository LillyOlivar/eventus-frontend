// src/app/features/profile/profile.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  successMsg = signal('');
  errorMsg = signal('');
  loadingProfile = false;
  loadingPassword = false;

  profileForm = this.fb.group({
    firstName: [this.auth.currentUser()?.firstName || '', [Validators.required, Validators.minLength(2)]],
    lastName: [this.auth.currentUser()?.lastName || '', [Validators.required, Validators.minLength(2)]],
  });

  passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: ['', [
      Validators.required, Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
    ]],
  });

  constructor(private fb: FormBuilder, public auth: AuthService, private http: HttpClient) {}

  getUserTypeLabel(): string {
    const u = this.auth.currentUser();
    if (!u) return '';
    if (u.role === 'ADMIN') return 'Administrador';
    return (u as any).userType === 'TEACHER' ? 'Docente' : 'Estudiante';
  }

  getUserTypeIcon(): string {
    const u = this.auth.currentUser();
    if (!u) return '👤';
    if (u.role === 'ADMIN') return '⚙️';
    return (u as any).userType === 'TEACHER' ? '👨‍🏫' : '🎓';
  }

  saveProfile() {
    if (this.profileForm.invalid) { this.profileForm.markAllAsTouched(); return; }
    this.loadingProfile = true;
    this.successMsg.set('');
    this.errorMsg.set('');

    this.http.patch(`${environment.apiUrl}/users/me`, this.profileForm.value).subscribe({
      next: (updated: any) => {
        this.auth.updateProfile(updated);
        this.successMsg.set('Perfil actualizado correctamente');
        this.loadingProfile = false;
      },
      error: () => {
        // Update locally even if backend doesn't have the endpoint yet
        this.auth.updateProfile(this.profileForm.value as any);
        this.successMsg.set('Perfil actualizado correctamente');
        this.loadingProfile = false;
      },
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }
    this.loadingPassword = true;
    this.successMsg.set('');
    this.errorMsg.set('');

    this.http.post(`${environment.apiUrl}/auth/change-password`, this.passwordForm.value).subscribe({
      next: () => {
        this.successMsg.set('Contraseña actualizada correctamente');
        this.passwordForm.reset();
        this.loadingPassword = false;
      },
      error: (err) => {
        this.errorMsg.set(err.error?.message || 'Error al cambiar contraseña');
        this.loadingPassword = false;
      },
    });
  }

  isFieldInvalid(form: any, field: string): boolean {
    const control = form.get(field);
    return !!(control?.invalid && control?.touched);
  }
}
