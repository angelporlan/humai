import { Component, HostListener } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FeedService } from '../services/feed.service';
import { FeedItemComponent } from "../components/feed-item/feed-item.component";
import { NgFor } from '@angular/common';
import { ShareboxComponent } from './sharebox/sharebox.component';

@Component({
    selector: 'app-home',
    imports: [FeedItemComponent, NgFor, ShareboxComponent],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    feed: any[] = [];
    nextPageUrl: string | null = null;
    loading = false;

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
                console.log(res)
                const newItems = Array.isArray(res.data) ? res.data : [res.data];
                this.feed = [...this.feed, ...newItems];
                this.nextPageUrl = res.links?.next || null;
                this.loading = false;
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
}
