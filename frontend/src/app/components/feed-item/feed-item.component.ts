import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FeedService } from '../../services/feed.service';

@Component({
    selector: 'app-feed-item',
    imports: [CommonModule],
    templateUrl: './feed-item.component.html',
    styleUrl: './feed-item.component.css'
})
export class FeedItemComponent {
    @Input() userAvatar: string = '';
    @Input() username: string = '';
    @Input() content: string = '';
    @Input() date: string = '';
    @Input() likes: number = 0;
    @Input() comments: number = 0;
    @Input() tags: string[] = [];
    @Input() reactions: string = '';
    @Input() postId: number = 0;
    @Input() userHasReacted: boolean = false;
    @Input() userReactionType: string = '';

    constructor(private router: Router, private feedService: FeedService) { }

    ngOnInit(): void {
        console.log(this.userReactionType);
    }

    navigateTo(path: string): void {
        this.router.navigate([path]);
    }

    reactToAPost(postId: number, type: string): void {
        this.feedService.reactToAPost(postId, type).subscribe((res) => {
            if (res.message === 'Reaction removed successfully') {
                this.likes--;
                this.userHasReacted = false;
            } else {
                this.likes++;
                this.userHasReacted = true;
            }
        });
    }
}
