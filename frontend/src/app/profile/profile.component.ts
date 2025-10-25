import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
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

  constructor(private route: ActivatedRoute, private profileService: ProfileService) { }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username')!;
    this.getInfoOfAUsername();
  }

  getInfoOfAUsername() {
    this.profileService.getInfoOfAUsername(this.username).subscribe((response: any) => {
      console.log(response);
      this.avatar = response.avatar;
      this.name = response.name;
      this.bio = response.bio;
      this.followers_count = response.followers_count;
      this.following_count = response.following_count;
      this.posts_count = response.posts_count;
    });
  }

}
