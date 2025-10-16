import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
    constructor(private authService: AuthService, private router: Router) { }

    logout() {
        this.authService.logout().subscribe({
            next: () => {
                localStorage.removeItem('token');
                this.router.navigate(['/auth/login']);
            },
            error: (err) => console.error(err)
        });
    }
}
