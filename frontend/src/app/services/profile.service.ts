import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  getInfoOfAUsername(username: string): Observable<any> {
    const token = JSON.parse(localStorage.getItem('humai') || '{}').token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/getInfoOfAUsername`, {
      params: { username },
      headers: headers
    });
  }

  getPostsReactedOfAUser(username: string): Observable<any> {
    const token = JSON.parse(localStorage.getItem('humai') || '{}').token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/getPostsReactedOfAUser`, {
      params: { username },
      headers: headers
    });
  }
}
