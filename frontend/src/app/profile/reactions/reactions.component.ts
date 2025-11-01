import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { FeedItemComponent } from '../../components/feed-item/feed-item.component';

@Component({
  selector: 'app-reactions',
  standalone: true,
  imports: [CommonModule, FeedItemComponent],
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.css']
})
export class ReactionsComponent implements OnInit, OnDestroy {
  posts: any[] = [];
  nextPageUrl: string | null = null;
  loading = false;
  username: string = '';
  private scrollListener: (() => void) | null = null;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.route.parent?.paramMap.subscribe(params => {
      this.username = params.get('username') || '';
      this.posts = [];
      this.nextPageUrl = null;
      this.getReactions();
    });

    this.scrollListener = this.onScroll.bind(this);
    window.addEventListener('scroll', this.scrollListener);
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  getReactions(url?: string) {
    if (this.loading) {
      console.log('Ya hay una petición en curso');
      return;
    }

    this.loading = true;
    console.log('Cargando reacciones...', url || 'primera página');

    this.profileService.getPostsReactedOfAUser(this.username).subscribe({
      next: (response: any) => {
        console.log('Respuesta recibida:', response);
        if (response.data && response.data.length > 0) {
          this.posts = [...this.posts, ...response.data];
          this.nextPageUrl = response.links?.next;
          console.log('Total reacciones:', this.posts.length);
          console.log('Next page URL:', this.nextPageUrl);
        } else {
          console.log('No hay más reacciones');
          this.nextPageUrl = null;
        }
      },
      error: (error) => {
        console.error('Error loading reactions:', error);
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

    if (distanceFromBottom < 300) {
      console.log('¡Cargando más reacciones!');
      this.getReactions(this.nextPageUrl);
    }
  }

  loadMore() {
    if (this.nextPageUrl && !this.loading) {
      this.getReactions(this.nextPageUrl);
    }
  }
}
