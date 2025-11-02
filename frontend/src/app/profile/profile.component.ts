import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { ProfileLoaderComponent } from './profile-loader/profile-loader.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ProfileLoaderComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
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

  constructor(private route: ActivatedRoute, private profileService: ProfileService, private router: Router) { }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username')!;
    this.loadProfileData();
    
    this.updateActiveTabFromUrl();
    
    this.route.url.subscribe(() => {
      this.updateActiveTabFromUrl();
    });
  }
  
  private updateActiveTabFromUrl(): void {
    const segments = this.router.url.split('/');
    const lastSegment = segments[segments.length - 1];
    if (['reactions', 'comments', 'posts'].includes(lastSegment)) {
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
      this.loading = false;
    });
  }

  changeUrl(tab: string) {
    this.activeTab = tab;
    this.router.navigate(['/profile', this.username, tab]);
  }
}
