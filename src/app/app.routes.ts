// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  {
    path: 'login', canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register', canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'events',
    loadComponent: () => import('./features/events/event-list/event-list.component').then(m => m.EventListComponent),
  },
  {
    path: 'events/:id',
    loadComponent: () => import('./features/events/event-detail/event-detail.component').then(m => m.EventDetailComponent),
  },
  {
    path: 'dashboard', canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'profile', canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
  },
  {
    path: 'admin', canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/admin/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent),
      },
      {
        path: 'events/new',
        loadComponent: () => import('./features/events/event-form/event-form.component').then(m => m.EventFormComponent),
      },
      {
        path: 'events/:id/edit',
        loadComponent: () => import('./features/events/event-form/event-form.component').then(m => m.EventFormComponent),
      },
    ],
  },
  { path: '**', redirectTo: '/events' },
];
