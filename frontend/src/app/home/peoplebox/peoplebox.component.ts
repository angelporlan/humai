import { Component, OnInit } from '@angular/core';
import { PeopleItemComponent } from './people-item/people-item.component';
import { NgFor } from '@angular/common';
import { RecommendService } from '../../services/recommend.service';

@Component({
  selector: 'app-peoplebox',
  imports: [PeopleItemComponent, NgFor],
  templateUrl: './peoplebox.component.html',
  styleUrl: './peoplebox.component.css'
})
export class PeopleboxComponent implements OnInit {
  people = [
    { avatar: 'default', username: 'user1', name: 'User 1', bio: 'Bio 1', followers_count: 100, mutual_followers: 50, is_following: false },
    { avatar: 'default', username: 'user2', name: 'User 2', bio: 'Bio 2', followers_count: 200, mutual_followers: 75, is_following: true },
    { avatar: 'default', username: 'user3', name: 'User 3', bio: 'Bio 3', followers_count: 150, mutual_followers: 60, is_following: false },
  ];

  constructor(private recommendService: RecommendService) { }

  ngOnInit(): void {
    this.recommendService.getUserRecommendation().subscribe({
      next: (response) => {
        console.log('User recommendations:', response);
        this.people = response.suggestions;
      },
      error: (error) => {
        console.error('Error fetching recommendations:', error);
      }
    });
  }

}
