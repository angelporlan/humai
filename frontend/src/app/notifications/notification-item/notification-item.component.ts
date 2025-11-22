import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-notification-item',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './notification-item.component.html',
    styleUrls: ['./notification-item.component.css']
})
export class NotificationItemComponent {
    @Input() notification: any;
    @Output() read = new EventEmitter<void>();

    onClick() {
        this.read.emit();
    }

    getIcon(): string {
        switch (this.notification.type) {
            case 'achievement':
                return 'icons/compass.svg';
            case 'like':
                return 'icons/heart.svg';
            case 'comment':
                return 'icons/message.svg';
            case 'follow':
                return 'icons/user.svg';
            default:
                return 'icons/bell.svg';
        }
    }
}
