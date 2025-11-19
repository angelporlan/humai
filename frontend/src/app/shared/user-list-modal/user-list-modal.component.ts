import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-list-modal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <button class="close-button" (click)="close()">&times;</button>
        </div>
        <div class="modal-body">
          <div *ngIf="loading" class="loading-spinner">Cargando...</div>
          <ul *ngIf="!loading" class="user-list">
            <li *ngFor="let user of users" class="user-item">
              <a [routerLink]="['/profile', user.username]" (click)="close()" class="user-link">
                <img [src]="'/avatars/' + user.avatar + '.jpg' || '/avatars/default.jpg'" [alt]="user.name" class="user-avatar">
                <div class="user-info">
                  <span class="user-name">{{ user.name }}</span>
                  <span class="user-username">{{ '@' + user.username }}</span>
                </div>
              </a>
            </li>
            <li *ngIf="users.length === 0" class="no-users">No hay usuarios para mostrar.</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 400px;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .modal-header {
      padding: 16px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .modal-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
    .close-button {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
    }
    .modal-body {
      padding: 0;
      overflow-y: auto;
    }
    .user-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .user-item {
      border-bottom: 1px solid #f0f0f0;
    }
    .user-link {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      text-decoration: none;
      color: inherit;
      transition: background-color 0.2s;
    }
    .user-link:hover {
      background-color: #f9f9f9;
    }
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 12px;
      object-fit: cover;
    }
    .user-info {
      display: flex;
      flex-direction: column;
    }
    .user-name {
      font-weight: 600;
      font-size: 14px;
    }
    .user-username {
      color: #666;
      font-size: 13px;
    }
    .loading-spinner {
      padding: 20px;
      text-align: center;
      color: #666;
    }
    .no-users {
      padding: 20px;
      text-align: center;
      color: #666;
    }
  `]
})
export class UserListModalComponent {
  @Input() title: string = '';
  @Input() users: any[] = [];
  @Input() loading: boolean = false;
  @Output() closeEvent = new EventEmitter<void>();

  close() {
    this.closeEvent.emit();
  }
}
