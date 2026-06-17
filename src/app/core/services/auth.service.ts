// src/app/core/services/auth.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthResponse, User } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'eventus_token';
  private readonly USER_KEY = 'eventus_user';

  private _currentUser = signal<User | null>(this.loadUser());
  private _token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));

  currentUser = this._currentUser.asReadonly();
  isLoggedIn = computed(() => !!this._token());
  isAdmin = computed(() => this._currentUser()?.role === 'ADMIN');
  isTeacher = computed(() => this._currentUser()?.userType === 'TEACHER');
  fullName = computed(() => {
    const u = this._currentUser();
    return u ? `${u.firstName} ${u.lastName}` : '';
  });
  userTypeLabel = computed(() => {
    const u = this._currentUser();
    if (!u) return '';
    if (u.role === 'ADMIN') return 'Administrador';
    return u.userType === 'TEACHER' ? 'Docente' : 'Estudiante';
  });

  constructor(private http: HttpClient, private router: Router) {}

  register(data: { email: string; password: string; firstName: string; lastName: string; userType: string }) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data).pipe(
      tap((res) => this.saveSession(res)),
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap((res) => this.saveSession(res)),
    );
  }

  updateProfile(data: Partial<User>) {
    const current = this._currentUser();
    if (current) {
      const updated = { ...current, ...data };
      localStorage.setItem(this.USER_KEY, JSON.stringify(updated));
      this._currentUser.set(updated);
    }
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._token.set(null);
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null { return this._token(); }

  private saveSession(res: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, res.access_token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
    this._token.set(res.access_token);
    this._currentUser.set(res.user);
  }

  private loadUser(): User | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}
