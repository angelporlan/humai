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
    followingFeed: any[] = [];
    forYouFeed: any[] = [];

    currentMode: 'foryou' | 'following' = 'foryou';

    nextPageUrlFollowing: string | null = null;
    nextPageUrlForYou: string | null = null;

    loading = false;
    firstLoadFollowing = true;
    firstLoadForYou = true;

    constructor(
        private authService: AuthService,
        private router: Router,
        private feedService: FeedService
    ) { }

    ngOnInit() {
        this.getForYouFeed();
    }

    switchMode(mode: 'foryou' | 'following') {
        this.currentMode = mode;
        if (mode === 'following' && this.firstLoadFollowing) {
            this.getFollowingFeed();
        } else if (mode === 'foryou' && this.firstLoadForYou) {
            this.getForYouFeed();
        }
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

    getFollowingFeed(url?: string) {
        if (this.loading) return;
        this.loading = true;

        this.feedService.getFeed(url).subscribe({
            next: (res) => {
                const newItems = Array.isArray(res.data) ? res.data : [res.data];
                this.followingFeed = [...this.followingFeed, ...newItems];
                this.nextPageUrlFollowing = res.links?.next || null;
                this.loading = false;
                this.firstLoadFollowing = false;
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
                this.firstLoadFollowing = false;
            }
        });
    }

    getForYouFeed(url?: string) {
        if (this.loading) return;
        this.loading = true;

        this.feedService.getExploreFeed(url).subscribe({
            next: (res) => {
                const newItems = Array.isArray(res.data) ? res.data : [res.data];
                this.forYouFeed = [...this.forYouFeed, ...newItems];
                this.nextPageUrlForYou = res.links?.next || null;
                this.loading = false;
                this.firstLoadForYou = false;
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
                this.firstLoadForYou = false;
            }
        });
    }

    @HostListener('window:scroll', [])
    onScroll(): void {
        const bottomReached =
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

        if (bottomReached && !this.loading) {
            if (this.currentMode === 'following' && this.nextPageUrlFollowing) {
                this.getFollowingFeed(this.nextPageUrlFollowing);
            } else if (this.currentMode === 'foryou' && this.nextPageUrlForYou) {
                this.getForYouFeed(this.nextPageUrlForYou);
            }
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

        this.followingFeed.unshift(normalizedPost);
    }
}
