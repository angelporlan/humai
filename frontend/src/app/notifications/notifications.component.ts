import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../services/notification.service';
import { RouterModule } from '@angular/router';
import { NotificationItemComponent } from './notification-item/notification-item.component';
import { NotificationItemLoaderComponent } from './notification-item-loader/notification-item-loader.component';

@Component({
    selector: 'app-notifications',
    standalone: true,
    imports: [CommonModule, RouterModule, NotificationItemComponent, NotificationItemLoaderComponent],
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
    notifications: any[] = [];
    loading = false;
    nextPageUrl: string | null = null;

    constructor(private notificationService: NotificationService) { }

    ngOnInit(): void {
        this.loadNotifications();
    }

    loadNotifications(url?: string) {
        if (this.loading) return;
        this.loading = true;

        this.notificationService.getNotifications(url).subscribe({
            next: (data: any) => {
                const newNotifications = data.data;
                this.notifications = [...this.notifications, ...newNotifications];
                this.nextPageUrl = data.next_page_url;
                this.loading = false;
            },
            error: (error: any) => {
                console.error('Error fetching notifications', error);
                this.loading = false;
            }
        });
    }

    @HostListener('window:scroll', [])
    onScroll(): void {
        const bottomReached = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

        if (bottomReached && this.nextPageUrl && !this.loading) {
            this.loadNotifications(this.nextPageUrl);
        }
    }

    markAsRead(notification: any) {
        if (!notification.read) {
            this.notificationService.markAsRead(notification.id).subscribe(() => {
                notification.read = true;
            });
        }
    }

    markAllAsRead() {
        this.notificationService.markAllAsRead().subscribe(() => {
            this.notifications.forEach(n => n.read = true);
        });
    }
}
