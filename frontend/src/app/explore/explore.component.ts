import { Component, OnInit, HostListener } from '@angular/core';
import { FeedService } from '../services/feed.service';
import { CommonModule } from '@angular/common';
import { FeedItemComponent } from "../components/feed-item/feed-item.component";
import { FeedItemLoaderComponent } from "../components/feed-item-loader/feed-item-loader.component";

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FeedItemComponent, FeedItemLoaderComponent],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements OnInit {
  posts: any[] = [];
  nextPageUrl: string | null = null;
  loading: boolean = false;
  firstLoad: boolean = true;

  constructor(private feedService: FeedService) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(url?: string) {
    if (this.loading) return;
    this.loading = true;

    this.feedService.getExploreFeed(url).subscribe({
      next: (response) => {
        const newItems = Array.isArray(response.data) ? response.data : [response.data];
        this.posts = [...this.posts, ...newItems];
        this.nextPageUrl = response.links?.next || null;
        this.loading = false;
        this.firstLoad = false;
      },
      error: (error) => {
        console.error('Error loading explore feed:', error);
        this.loading = false;
        this.firstLoad = false;
      }
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const bottomReached =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

    if (bottomReached && this.nextPageUrl && !this.loading) {
      this.loadPosts(this.nextPageUrl);
    }
  }

  loadMore() {
    if (this.nextPageUrl) {
      this.loadPosts(this.nextPageUrl);
    }
  }
}
