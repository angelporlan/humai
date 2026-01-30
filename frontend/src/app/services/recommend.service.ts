import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecommendService {

  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) { }

  getUserRecommendation(): Observable<any> {
    const token = JSON.parse(localStorage.getItem('humai') || '{}').token;
    return this.http.get(`${this.apiUrl}/recommendations/users`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }

  getTrendingRecommendation(): Observable<any> {
    const token = JSON.parse(localStorage.getItem('humai') || '{}').token;
    return this.http.get(`${this.apiUrl}/recommendations/trending`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }
}
