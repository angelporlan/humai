import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-list-modal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list-modal.component.html',
  styleUrls: ['./user-list-modal.component.css'],
})
export class UserListModalComponent {
  @Input() title: string = '';
  @Input() users: any[] = [];
  @Input() loading: boolean = false;
  @Output() closeEvent = new EventEmitter<void>();

  close() {
    this.closeEvent.emit();
  }
}
