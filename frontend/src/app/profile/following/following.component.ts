import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-following',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
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
        this.profileService.notifyFollowChange(user.username, 'follow');
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
        this.profileService.notifyFollowChange(user.username, 'unfollow');
      },
      (error) => {
        console.error('Error unfollowing user:', error);
      }
    );
  }
}
