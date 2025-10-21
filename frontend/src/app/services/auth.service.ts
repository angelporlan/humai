import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  register(username: string, email: string, password: string, password_confirmation: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password, password_confirmation });
  }

  me(): Observable<any> {
    const token = JSON.parse(localStorage.getItem('humai') || '{}').token;
    return this.http.get(`${this.apiUrl}/me`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }

  logout(): Observable<any> {
    const token = JSON.parse(localStorage.getItem('humai') || '{}').token;
      return this.http.post(`${this.apiUrl}/logout`,
      {},  
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      }
    );
  }

  isLoggedIn(): boolean {
    const token = JSON.parse(localStorage.getItem('humai') || '{}').token;
    return !!token;
  }
}
