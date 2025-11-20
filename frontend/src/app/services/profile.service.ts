import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  // Subject para notificar cambios en follows
  private followChangeSubject = new Subject<{ username: string, action: 'follow' | 'unfollow' }>();
  public followChange$ = this.followChangeSubject.asObservable();

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

  followUser(username: string): Observable<any> {
    const token = JSON.parse(localStorage.getItem('humai') || '{}').token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/follow`,
      { username },
      { headers: headers }
    );
  }

  unfollowUser(username: string): Observable<any> {
    const token = JSON.parse(localStorage.getItem('humai') || '{}').token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/unfollow`,
      { username },
      { headers: headers }
    );
  }

  getFollowers(username: string): Observable<any> {
    const token = JSON.parse(localStorage.getItem('humai') || '{}').token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/users/${username}/followers`, { headers: headers });
  }

  getFollowing(username: string): Observable<any> {
    const token = JSON.parse(localStorage.getItem('humai') || '{}').token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/users/${username}/following`, { headers: headers });
  }

  notifyFollowChange(username: string, action: 'follow' | 'unfollow') {
    this.followChangeSubject.next({ username, action });
  }
}
