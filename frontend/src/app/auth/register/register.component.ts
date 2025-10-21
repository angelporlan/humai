import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-register',
    imports: [FormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    username = '';
    email = '';
    password = '';
    password_confirmation = '';

    constructor(private authService: AuthService, private router: Router) { }

    register() {
        this.authService.register(this.username, this.email, this.password, this.password_confirmation).subscribe({
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
