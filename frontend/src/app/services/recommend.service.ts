import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecommendService {

    private apiUrl = 'http://127.0.0.1:8000/api';
  
    constructor(private http: HttpClient) { }
  
    getUserRecommendation(): Observable<any> {
      const token = JSON.parse(localStorage.getItem('humai') || '{}').token;
      return this.http.get(`${this.apiUrl}/recommendations/users`, {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      });
    }
}
