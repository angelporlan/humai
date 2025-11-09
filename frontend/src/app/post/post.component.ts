import { Component, OnInit } from '@angular/core';
import { FeedService } from '../services/feed.service';
import { FeedItemComponent } from "../components/feed-item/feed-item.component";
import { FeedItemLoaderComponent } from "../components/feed-item-loader/feed-item-loader.component";
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule,
    FeedItemComponent,
    FeedItemLoaderComponent,
    NgIf,
    NgFor
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {
  postId: number;
  post: any;
  firstLoad: boolean = true;

  constructor(
    private feedService: FeedService,
    private route: ActivatedRoute
  ) {
    this.postId = 0;
  }

  ngOnInit(): void {    
    this.route.params.subscribe(params => {
      this.postId = +params['postId'];
      this.loadPost();
    });
  }

  loadPost(): void {
    this.firstLoad = true;
    this.feedService.getPost(this.postId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.post = response.data;
        this.firstLoad = false;
      },
      error: (error) => {
        console.error('Error loading post:', error);
        this.firstLoad = false;
      }
    });
  }

  goBack(): void {
    window.history.back();
  }
}
