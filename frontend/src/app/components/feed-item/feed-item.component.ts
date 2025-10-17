import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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
}
