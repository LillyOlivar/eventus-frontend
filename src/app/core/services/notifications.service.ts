// src/app/core/services/notifications.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { Notification } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private _notifications = signal<Notification[]>(this.load());

  notifications = this._notifications.asReadonly();
  unreadCount = computed(() => this._notifications().filter(n => !n.read).length);

  add(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) {
    const n: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [n, ...this._notifications()];
    this._notifications.set(updated);
    this.save(updated);
  }

  markRead(id: string) {
    const updated = this._notifications().map(n => n.id === id ? { ...n, read: true } : n);
    this._notifications.set(updated);
    this.save(updated);
  }

  markAllRead() {
    const updated = this._notifications().map(n => ({ ...n, read: true }));
    this._notifications.set(updated);
    this.save(updated);
  }

  private save(notifications: Notification[]) {
    localStorage.setItem('eventus_notifications', JSON.stringify(notifications));
  }

  private load(): Notification[] {
    const stored = localStorage.getItem('eventus_notifications');
    return stored ? JSON.parse(stored) : [];
  }
}
