import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-following',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="user-list-container">
      <div *ngIf="loading" class="loading-spinner">Cargando...</div>
      <ul *ngIf="!loading" class="user-list">
        <li *ngFor="let user of users" class="user-item">
          <div class="user-content">
            <a [routerLink]="['/profile', user.username]" class="user-link">
              <img [src]="'/avatars/' + user.avatar + '.jpg' || '/avatars/default.jpg'" [alt]="user.name" class="user-avatar">
              <div class="user-info">
                <span class="user-name">{{ user.name }}</span>
                <span class="user-username">{{ '@' + user.username }}</span>
                <p class="user-bio" *ngIf="user.bio">{{ user.bio }}</p>
              </div>
            </a>
            <div class="action-button">
              <button *ngIf="!user.is_following && user.username !== currentUsername" class="follow-button" (click)="followUser(user)">Seguir</button>
              <button *ngIf="user.is_following && user.username !== currentUsername" class="unfollow-button" (click)="unfollowUser(user)">Siguiendo</button>
            </div>
          </div>
        </li>
        <li *ngIf="users.length === 0" class="no-users">No hay usuarios seguidos para mostrar.</li>
      </ul>
    </div>
  `,
  styles: [`
    .user-list-container {
      background: white;
      border-radius: 12px;
      padding: 16px;
    }
    .user-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .user-item {
      border-bottom: 1px solid #f0f0f0;
      padding: 12px 0;
    }
    .user-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .user-link {
      display: flex;
      align-items: flex-start;
      text-decoration: none;
      color: inherit;
      flex: 1;
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
    .user-bio {
      margin: 4px 0 0;
      font-size: 13px;
      color: #333;
    }
    .action-button {
      margin-left: 12px;
    }
    .follow-button {
      background-color: #000;
      color: white;
      border: none;
      padding: 6px 16px;
      border-radius: 20px;
      font-weight: 600;
      cursor: pointer;
      font-size: 13px;
    }
    .unfollow-button {
      background-color: white;
      color: #000;
      border: 1px solid #cfd9de;
      padding: 6px 16px;
      border-radius: 20px;
      font-weight: 600;
      cursor: pointer;
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
export class FollowingComponent implements OnInit {
  users: any[] = [];
  loading: boolean = true;
  username: string = '';
  currentUsername: string = '';

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.currentUsername = JSON.parse(localStorage.getItem('humai') || '{}').username;

    // The parent route has the username parameter
    this.route.parent?.paramMap.subscribe(params => {
      this.username = params.get('username')!;
      this.loadFollowing();
    });
  }

  loadFollowing() {
    this.loading = true;
    this.profileService.getFollowing(this.username).subscribe(
      (users: any[]) => {
        this.users = users;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching following:', error);
        this.loading = false;
      }
    );
  }

  followUser(user: any) {
    this.profileService.followUser(user.username).subscribe(
      () => {
        user.is_following = true;
      },
      (error) => {
        console.error('Error following user:', error);
      }
    );
  }

  unfollowUser(user: any) {
    this.profileService.unfollowUser(user.username).subscribe(
      () => {
        user.is_following = false;
      },
      (error) => {
        console.error('Error unfollowing user:', error);
      }
    );
  }
}
