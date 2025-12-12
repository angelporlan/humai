import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlashNotificationComponent } from './components/flash-notification/flash-notification.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FlashNotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
