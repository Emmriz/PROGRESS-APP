import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://127.0.0.1:8000/api'; // your Laravel API

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data, {
      headers: new HttpHeaders({ 'Accept': 'application/json' })
    });
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data, {
      headers: new HttpHeaders({ 'Accept': 'application/json' })
    });
  }

  logout(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      })
    });
  }
}
