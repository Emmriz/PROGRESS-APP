import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Submission {
  id: number;
  details: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user?: { name: string };
  screenshot_path?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  private apiUrl = 'http://localhost:8000/api/admin/submissions';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  getSubmissions(): Observable<Submission[]> {
    return this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      map(res => res.data || []) // ensure we always return an array
    );
  }

  updateSubmissionStatus(id: number, status: string): Observable<any> {
    // PATCH instead of PUT
    return this.http.patch(`${this.apiUrl}/${id}`, { status }, { headers: this.getAuthHeaders() });
  }


  deleteSubmission(id: number): Observable<any> {
  // Use POST with _method override if DELETE is not allowed
  return this.http.post(`${this.apiUrl}/${id}`, { _method: 'DELETE' }, { headers: this.getAuthHeaders() });
  }
}
