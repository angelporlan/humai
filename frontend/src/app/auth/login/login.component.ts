import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  styles: [`
    .error-alert {
      background-color: rgba(220, 38, 38, 0.1);
      color: #dc2626;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 14px;
      border: 1px solid rgba(220, 38, 38, 0.2);
    }
  `]
})
export class LoginComponent {
  email = 'angel@example.com';
  password = 'secret123';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        const dataRes = {
          token: res.token,
          username: res.user.username,
          avatar: res.user.avatar
        }
        localStorage.setItem('humai', JSON.stringify(dataRes));
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error.message || 'Error al iniciar sesión. Por favor verifica tus credenciales.';
      }
    });
  }
}
