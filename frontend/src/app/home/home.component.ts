import { Component, HostListener } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FeedService } from '../services/feed.service';
import { FeedItemComponent } from "../components/feed-item/feed-item.component";
import { FeedItemLoaderComponent } from "../components/feed-item-loader/feed-item-loader.component";
import { NgFor, NgIf } from '@angular/common';
import { ShareboxComponent } from './sharebox/sharebox.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [FeedItemComponent, FeedItemLoaderComponent, NgFor, ShareboxComponent, NgIf],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    feed: any[] = [];
    nextPageUrl: string | null = null;
    loading = false;
    firstLoad = true;

    constructor(
        private authService: AuthService,
        private router: Router,
        private feedService: FeedService
    ) { }

    ngOnInit() {
        this.getFeed();
    }

    logout() {
        this.authService.logout().subscribe({
            next: () => {
                localStorage.removeItem('humai');
                this.router.navigate(['/auth/login']);
            },
            error: (err) => console.error(err)
        });
    }

    getFeed(url?: string) {
        if (this.loading) return;
        this.loading = true;

        this.feedService.getFeed(url).subscribe({
            next: (res) => {
                console.log(res);
                const newItems = Array.isArray(res.data) ? res.data : [res.data];
                this.feed = [...this.feed, ...newItems];
                this.nextPageUrl = res.links?.next || null;
                this.loading = false;
                this.firstLoad = false;
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
            }
        });
    }

    @HostListener('window:scroll', [])
    onScroll(): void {
        const bottomReached =
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

        if (bottomReached && this.nextPageUrl && !this.loading) {
            this.getFeed(this.nextPageUrl);
        }
    }

    handleNewPost(post: any) {
        const userData = JSON.parse(localStorage.getItem('humai') || '{}');

        const normalizedPost = {
            ...post,
            comments_count: post.comments_count || 0,
            likes_count: post.likes_count || 0,
            tags: post.tags || [],
            user: {
                id: post.user_id || userData.id,
                username: userData.username || 'Usuario',
                avatar: userData.avatar || 'default'
            },
            created_at: post.created_at || new Date().toISOString()
        };

        this.feed.unshift(normalizedPost);
    }
}
