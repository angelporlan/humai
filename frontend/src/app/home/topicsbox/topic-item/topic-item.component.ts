import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-topic-item',
  imports: [],
  templateUrl: './topic-item.component.html',
  styleUrl: './topic-item.component.css'
})
export class TopicItemComponent {

  @Input() topic: string = '';
  @Input() postNumber: GLfloat = 1.1;

}
