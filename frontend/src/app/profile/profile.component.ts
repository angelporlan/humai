import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { AuthService } from '../services/auth.service';
import { ProfileLoaderComponent } from './profile-loader/profile-loader.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ProfileLoaderComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string = '';
  avatar: string = '';
  name: string = '';
  bio: string = '';
  followers_count: number = 0;
  following_count: number = 0;
  posts_count: number = 0;
  posts: any[] = [];
  activeTab: string = 'posts';
  loading = false;
  isFollowing: boolean = false;
  isOwnProfile: boolean = false;
  currentUsername: string = '';

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUsername = JSON.parse(localStorage.getItem('humai') || '{}').username;

    this.route.paramMap.subscribe(params => {
      this.username = params.get('username')!;
      this.loadProfileData();
    });

    this.updateActiveTabFromUrl();

    this.route.url.subscribe(() => {
      this.updateActiveTabFromUrl();
    });

    this.profileService.followChange$.subscribe(change => {
      console.log('Follow change detected:', change, 'Current profile:', this.username);

      if (change.username === this.username) {
        if (change.action === 'follow') {
          this.followers_count++;
          console.log('Incrementing followers count:', this.followers_count);
        } else if (change.action === 'unfollow') {
          this.followers_count--;
          console.log('Decrementing followers count:', this.followers_count);
        }
      }

      if (this.isOwnProfile) {
        if (change.action === 'follow') {
          this.following_count++;
          console.log('Incrementing following count:', this.following_count);
        } else if (change.action === 'unfollow') {
          this.following_count--;
          console.log('Decrementing following count:', this.following_count);
        }
      }
    });
  }

  private updateActiveTabFromUrl(): void {
    const segments = this.router.url.split('/');
    const lastSegment = segments[segments.length - 1];
    if (['reactions', 'comments', 'posts', 'followers', 'following'].includes(lastSegment)) {
      this.activeTab = lastSegment;
    } else {
      this.activeTab = 'posts';
    }
  }

  loadProfileData() {
    this.getInfoOfAUsername();
  }

  getInfoOfAUsername() {
    this.loading = true;
    this.profileService.getInfoOfAUsername(this.username).subscribe((response: any) => {
      console.log(response);
      this.avatar = response.avatar;
      this.name = response.name;
      this.bio = response.bio;
      this.followers_count = response.followers_count;
      this.following_count = response.following_count;
      this.posts_count = response.posts_count;
      this.isFollowing = response.is_following;
      this.loading = false;

      this.currentUsername = JSON.parse(localStorage.getItem('humai') || '{}').username;
      this.isOwnProfile = this.username === this.currentUsername;
    });
  }

  followUser() {
    this.profileService.followUser(this.username).subscribe(
      (response: any) => {
        this.isFollowing = true;
        this.followers_count++;
      },
      (error: any) => {
        console.error('Error following user:', error);
      }
    );
  }

  unfollowUser() {
    this.profileService.unfollowUser(this.username).subscribe(
      (response: any) => {
        this.isFollowing = false;
        this.followers_count--;
      },
      (error: any) => {
        console.error('Error unfollowing user:', error);
      }
    );
  }

  changeUrl(tab: string) {
    this.activeTab = tab;
    this.router.navigate(['/profile', this.username, tab]);
  }

  editProfile() {
    this.router.navigate(['/settings']);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('humai');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Logout failed', err);
        localStorage.removeItem('humai');
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
