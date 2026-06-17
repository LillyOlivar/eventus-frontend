// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { NotificationsService } from './core/services/notifications.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  showNotif = false;

  constructor(
    public authService: AuthService,
    public notifService: NotificationsService,
  ) {}

  toggleNotif() { this.showNotif = !this.showNotif; }
}
