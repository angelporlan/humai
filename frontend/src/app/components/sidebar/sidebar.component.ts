import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  currtentRoute: string = '';
  isSidebarHidden: boolean = false;

  constructor(private router: Router) { }

  navigateTo(path: string): void {
    const newRoute = `dashboard/${path}`;
    this.router.navigate([newRoute]);
  }

  isActive(path: string): boolean {
    const currentRoute = this.router.url;
    const segments = currentRoute.split('/');
    return segments.includes(path);
  }

}
