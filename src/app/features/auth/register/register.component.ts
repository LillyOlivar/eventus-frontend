// src/app/features/auth/register/register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    userType: ['STUDENT', [Validators.required]],
    password: ['', [
      Validators.required, Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
    ]],
  });

  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  getFieldError(field: string): string {
    const control = this.registerForm.get(field);
    if (control?.errors?.['required']) return 'Este campo es requerido';
    if (control?.errors?.['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    if (control?.errors?.['email']) return 'Correo inválido';
    if (control?.errors?.['pattern']) return 'Debe tener mayúscula, minúscula, número y símbolo (@$!%*?&)';
    return '';
  }

  onSubmit() {
    if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); return; }
    this.loading = true;
    this.errorMessage = '';
    this.authService.register(this.registerForm.value as any).subscribe({
      next: () => this.router.navigate(['/events']),
      error: (err) => {
        this.errorMessage = Array.isArray(err.error?.message)
          ? err.error.message.join(', ')
          : (err.error?.message || 'Error al registrarse');
        this.loading = false;
      },
    });
  }
}
