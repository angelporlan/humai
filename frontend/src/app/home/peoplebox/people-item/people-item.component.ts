import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-people-item',
  imports: [],
  templateUrl: './people-item.component.html',
  styleUrl: './people-item.component.css'
})
export class PeopleItemComponent {
  @Input() avatar: string = 'default.jpg';
  @Input() username: string = '';
}
