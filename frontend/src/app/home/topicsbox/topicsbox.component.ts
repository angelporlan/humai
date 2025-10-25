import { Component } from '@angular/core';
import { TopicItemComponent } from './topic-item/topic-item.component';

@Component({
  selector: 'app-topicsbox',
  imports: [TopicItemComponent],
  templateUrl: './topicsbox.component.html',
  styleUrl: './topicsbox.component.css'
})
export class TopicsboxComponent {

}
