import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FeedService } from '../services/feed.service';
import { FeedItemComponent } from "../components/feed-item/feed-item.component";
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-home',
    imports: [FeedItemComponent, NgFor],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    feed: any[] = [];
    constructor(private authService: AuthService, private router: Router, private feedService: FeedService) { }

    ngOnInit() {
        this.getFeed();
    }

    logout() {
        this.authService.logout().subscribe({
            next: () => {
                localStorage.removeItem('token');
                this.router.navigate(['/auth/login']);
            },
            error: (err) => console.error(err)
        });
    }

    getFeed() {
        console.log('getFeed');
        this.feedService.getFeed().subscribe({
            next: (res) => {
                console.log(res);
                this.feed = Array.isArray(res.data) ? res.data : [res.data];
                console.log(this.feed);
            },
            error: (err) => console.error(err)
        });
    }
}
