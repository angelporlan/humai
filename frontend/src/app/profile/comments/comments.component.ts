import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedService } from '../../services/feed.service';
import { CommonModule } from '@angular/common';
import { FeedItemComponent } from '../../components/feed-item/feed-item.component';
import { FeedItemLoaderComponent } from '../../components/feed-item-loader/feed-item-loader.component';

@Component({
  selector: 'app-comments',
  imports: [CommonModule, FeedItemComponent, FeedItemLoaderComponent],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent {
  posts: any[] = [];
  nextPageUrl: string | null = null;
  loading = false;
  username: string = '';
  firstLoad = true;
  private scrollListener: (() => void) | null = null;

  constructor(
    private route: ActivatedRoute,
    private feedService: FeedService
  ) { }

  ngOnInit() {
    this.route.parent?.paramMap.subscribe(params => {
      this.username = params.get('username') || '';
      this.posts = [];
      this.nextPageUrl = null;
      this.getPosts();
    });

    this.scrollListener = this.onScroll.bind(this);
    window.addEventListener('scroll', this.scrollListener);
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  getPosts(url?: string) {
    if (this.loading) {
      console.log('Ya hay una petición en curso');
      return;
    }

    this.loading = true;
    console.log('Cargando posts...', url || 'primera página');

    this.feedService.getCommentsOfAUser(this.username, url).subscribe({
      next: (response: any) => {
        console.log('Respuesta recibida:', response);
        this.firstLoad = false;
        if (response.data && response.data.length > 0) {
          this.posts = [...this.posts, ...response.data];
          this.nextPageUrl = response.links?.next;
          console.log('Total posts:', this.posts.length);
          console.log('Next page URL:', this.nextPageUrl);
        } else {
          console.log('No hay más posts');
          this.nextPageUrl = null;
        }
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        console.log('Petición completada');
      }
    });
  }

  onScroll(): void {
    if (this.loading || !this.nextPageUrl) {
      return;
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

    // console.log('Scroll info:', {
    //   scrollTop,
    //   windowHeight,
    //   documentHeight,
    //   distanceFromBottom
    // });

    if (distanceFromBottom < 300) {
      console.log('¡Cargando más posts!');
      this.getPosts(this.nextPageUrl);
    }
  }

  loadMore() {
    if (this.nextPageUrl && !this.loading) {
      this.getPosts(this.nextPageUrl);
    }
  }
}
