import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topic-item',
  standalone: true,
  imports: [],
  templateUrl: './topic-item.component.html',
  styleUrl: './topic-item.component.css'
})
export class TopicItemComponent {

  @Input() topic: string = '';
  @Input() postNumber: number = 0;

  constructor(private router: Router) { }

  onTopicClick() {
    this.router.navigate(['/search'], { queryParams: { q: this.topic } });
  }
}
