import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashService, FlashNotification } from '../../services/flash.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-flash-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flash-notification.component.html',
  styleUrl: './flash-notification.component.css'
})
export class FlashNotificationComponent implements OnInit, OnDestroy {
  notifications: FlashNotification[] = [];
  private subscription?: Subscription;

  constructor(private flashService: FlashService) { }

  ngOnInit(): void {
    this.subscription = this.flashService.notifications$.subscribe(
      notifications => this.notifications = notifications
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  close(id: string): void {
    this.flashService.remove(id);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '';
    }
  }
}
