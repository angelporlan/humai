import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-people-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './people-item.component.html',
  styleUrl: './people-item.component.css'
})
export class PeopleItemComponent {
  private router = inject(Router);
  private profileService = inject(ProfileService);

  @Input() avatar: string = 'default.jpg';
  @Input() username: string = '';
  @Input() name: string = '';
  @Input() bio: string = '';
  @Input() followersCount: number = 0;
  @Input() mutualFollowers: number = 0;
  @Input() isFollowing: boolean = false;

  navigateToProfile(): void {
    this.router.navigate(['/profile', this.username]);
  }

  toggleFollow(event: Event): void {
    event.stopPropagation();

    if (this.isFollowing) {
      this.profileService.unfollowUser(this.username).subscribe({
        next: () => {
          this.isFollowing = false;
          this.followersCount--;
        },
        error: (err: any) => console.error('Error unfollowing user:', err)
      });
    } else {
      this.profileService.followUser(this.username).subscribe({
        next: () => {
          this.isFollowing = true;
          this.followersCount++;
        },
        error: (err: any) => console.error('Error following user:', err)
      });
    }
  }

}