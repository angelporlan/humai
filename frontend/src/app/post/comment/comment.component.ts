import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  @Input() comment: string = '';
  @Input() createdAt: string = '';
  @Input() username: string = '';
  @Input() avatar: string = '';
  @Input() commentId: number = 0;
  
  // Add any additional methods for like/reply functionality here
}
