import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = 'http://127.0.0.1:8000/api/notifications';

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = JSON.parse(localStorage.getItem('humai') || '{}').token;
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    getNotifications(url?: string): Observable<any> {
        return this.http.get(url || this.apiUrl, { headers: this.getHeaders() });
    }

    markAsRead(id: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/read`, {}, { headers: this.getHeaders() });
    }

    markAllAsRead(): Observable<any> {
        return this.http.post(`${this.apiUrl}/read-all`, {}, { headers: this.getHeaders() });
    }
}
