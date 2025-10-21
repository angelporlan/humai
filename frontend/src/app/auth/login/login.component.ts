import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = 'angel@example.com';
  password = 'secret123';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        const dataRes = {
          token: res.token,
          username: res.user.username
        }
        localStorage.setItem('humai', JSON.stringify(dataRes));
        this.router.navigate(['/home']);
      },
      error: (err) => console.error(err)
    });
  }
}
