import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  getFeed(url?: string): Observable<any> {
    const token = JSON.parse(localStorage.getItem('humai') || '{}').token;
    if (url) {
      return this.http.get(`${url}`, {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    }
    return this.http.get(`${this.apiUrl}/feed`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }

  getPostsOfAUser(username: string, url?: string): Observable<any> {
    const token = JSON.parse(localStorage.getItem('humai') || '{}').token;
    if (url) {
      const body = { username };
      return this.http.get(`${url}`, {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        }),
        params: body
      });
    }
    return this.http.get(`${this.apiUrl}/getPostsOfAUser?username=${username}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }
}
