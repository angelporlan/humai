import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicItemComponent } from './topic-item/topic-item.component';
import { RecommendService } from '../../services/recommend.service';

@Component({
  selector: 'app-topicsbox',
  standalone: true,
  imports: [CommonModule, TopicItemComponent],
  templateUrl: './topicsbox.component.html',
  styleUrl: './topicsbox.component.css'
})
export class TopicsboxComponent implements OnInit {
  topics: any[] = [];
  loading = true;

  constructor(private recommendService: RecommendService) { }

  ngOnInit(): void {
    this.recommendService.getTrendingRecommendation().subscribe({
      next: (data: any) => {
        console.log('Trending data:', data);
        if (data.trends && Array.isArray(data.trends)) {
          this.topics = data.trends;
        } else if (data.trends && typeof data.trends === 'object') {
          this.topics = Object.values(data.trends);
        } else if (Array.isArray(data)) {
          this.topics = data;
        } else {
          this.topics = Object.values(data);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching trending topics:', err);
        this.loading = false;
      }
    });
  }
}
