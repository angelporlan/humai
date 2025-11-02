import { Component } from '@angular/core';
import { PeopleItemComponent } from './people-item/people-item.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-peoplebox',
  imports: [PeopleItemComponent,NgFor],
  templateUrl: './peoplebox.component.html',
  styleUrl: './peoplebox.component.css'
})
export class PeopleboxComponent {
    people = [
        { avatar: 'default', username: 'user1' },
        { avatar: 'default', username: 'user2' },
        { avatar: 'default', username: 'user3' },
    ];

}
