import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  currentRoute: string = '';
  username: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    try {
      const userData = localStorage.getItem('humai');
      if (userData) {
        const user = JSON.parse(userData);
        this.username = user?.username || '';
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  }

  navigateTo(path: string): void {
    if (path === 'profile' && this.username) {
      this.router.navigate([`profile/${this.username}`]);
    } else {
      this.router.navigate([path]);
    }
  }

  isActive(path: string): boolean {
    const currentRoute = this.router.url;
    const segments = currentRoute.split('/');
    return segments.includes(path);
  }
}
