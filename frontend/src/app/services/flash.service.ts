import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FlashNotification {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
}

@Injectable({
    providedIn: 'root'
})
export class FlashService {
    private notificationsSubject = new BehaviorSubject<FlashNotification[]>([]);
    public notifications$: Observable<FlashNotification[]> = this.notificationsSubject.asObservable();

    constructor() { }

    private show(type: FlashNotification['type'], message: string, duration: number = 3000): void {
        const id = this.generateId();
        const notification: FlashNotification = { id, type, message, duration };

        const currentNotifications = this.notificationsSubject.value;
        this.notificationsSubject.next([...currentNotifications, notification]);

        if (duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, duration);
        }
    }

    success(message: string, duration?: number): void {
        this.show('success', message, duration);
    }

    error(message: string, duration?: number): void {
        this.show('error', message, duration);
    }

    info(message: string, duration?: number): void {
        this.show('info', message, duration);
    }

    warning(message: string, duration?: number): void {
        this.show('warning', message, duration);
    }

    remove(id: string): void {
        const currentNotifications = this.notificationsSubject.value;
        this.notificationsSubject.next(currentNotifications.filter(n => n.id !== id));
    }

    clear(): void {
        this.notificationsSubject.next([]);
    }

    private generateId(): string {
        return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
