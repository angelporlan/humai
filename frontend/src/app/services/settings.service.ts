import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = `${environment.apiUrl}/api/settings`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('humai') || '{}').token;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getSettings(): Observable<any> {
    return this.http.get(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  updateProfile(data: { name?: string; bio?: string; avatar?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, data, { headers: this.getHeaders() });
  }

  updatePrivacySettings(data: { is_private?: boolean; allow_comments_from?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/privacy`, data, { headers: this.getHeaders() });
  }

  updateNotificationSettings(data: { email_notifications?: boolean; push_notifications?: boolean }): Observable<any> {
    return this.http.put(`${this.apiUrl}/notifications`, data, { headers: this.getHeaders() });
  }

  changePassword(data: { current_password: string; new_password: string; new_password_confirmation: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/password`, data, { headers: this.getHeaders() });
  }

  deleteAccount(password: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/account`, {
      headers: this.getHeaders(),
      body: { password }
    });
  }
}
