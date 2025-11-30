import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeedService } from '../services/feed.service';
import { CommonModule } from '@angular/common';
import { FeedItemComponent } from "../components/feed-item/feed-item.component";
import { FeedItemLoaderComponent } from "../components/feed-item-loader/feed-item-loader.component";

@Component({
    selector: 'app-search-results',
    standalone: true,
    imports: [CommonModule, FeedItemComponent, FeedItemLoaderComponent],
    templateUrl: './search-results.component.html',
    styleUrl: './search-results.component.css'
})
export class SearchResultsComponent implements OnInit {
    posts: any[] = [];
    nextPageUrl: string | null = null;
    loading: boolean = false;
    firstLoad: boolean = true;
    query: string = '';

    constructor(
        private feedService: FeedService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.query = params['q'];
            if (this.query) {
                this.posts = [];
                this.firstLoad = true;
                this.loadPosts();
            }
        });
    }

    loadPosts(url?: string) {
        if (this.loading) return;
        this.loading = true;

        this.feedService.searchPosts(this.query, url).subscribe({
            next: (response) => {
                const userData = JSON.parse(localStorage.getItem('humai') || '{}');
                const newItems = Array.isArray(response.data) ? response.data : [response.data];
                this.posts = [...this.posts, ...newItems];
                this.nextPageUrl = response.links?.next || null;
                this.loading = false;
                this.firstLoad = false;
            },
            error: (error) => {
                console.error('Error loading search results:', error);
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
}
