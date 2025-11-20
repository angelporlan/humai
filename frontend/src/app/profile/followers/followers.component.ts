import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-followers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent implements OnInit {
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

    this.route.parent?.paramMap.subscribe(params => {
      this.username = params.get('username')!;
      this.loadFollowers();
    });
  }

  loadFollowers() {
    this.loading = true;
    this.profileService.getFollowers(this.username).subscribe(
      (users: any[]) => {
        this.users = users;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching followers:', error);
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
