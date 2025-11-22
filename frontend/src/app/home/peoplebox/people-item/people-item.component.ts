import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-people-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './people-item.component.html',
  styleUrl: './people-item.component.css'
})
export class PeopleItemComponent {
  private router = inject(Router);

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

}