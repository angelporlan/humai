import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormsModule, RouterLink, CommonModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
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
export class RegisterComponent {
    username = '';
    email = '';
    password = '';
    password_confirmation = '';
    errorMessage: string = '';

    constructor(private authService: AuthService, private router: Router) { }

    register() {
        this.authService.register(this.username, this.email, this.password, this.password_confirmation).subscribe({
            next: (res) => {
                const dataRes = {
                    token: res.token,
                    username: res.user.username,
                    avatar: '1'
                }
                localStorage.setItem('humai', JSON.stringify(dataRes));
                this.router.navigate(['/home']);
            },
            error: (err) => {
                console.error(err);
                if (err.error && err.error.message) {
                    this.errorMessage = err.error.message;
                } else if (err.error && err.error.errors) {
                    const firstError = Object.values(err.error.errors)[0] as string[];
                    this.errorMessage = firstError ? firstError[0] : 'Error al registrarse. Por favor verifica tus datos.';
                } else {
                    this.errorMessage = 'Error al registrarse. Por favor intenta nuevamente.';
                }
            }
        });
    }
}
