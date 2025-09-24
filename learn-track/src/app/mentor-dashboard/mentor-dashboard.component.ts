import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // 👈 import this
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mentor-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],  // 👈 include CommonModule here
  templateUrl: './mentor-dashboard.component.html',
  styleUrls: ['./mentor-dashboard.component.css']
})
export class MentorDashboardComponent implements OnInit {
  submissions: any[] = [];
  user: any = null;
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchSubmissions();
  }

  get pendingCount() {
    return this.submissions.filter(s => s.status === 'pending').length;
  }

  get approvedCount() {
    return this.submissions.filter(s => s.status === 'approved').length;
  }

  fetchSubmissions() {
    const token = localStorage.getItem('auth_token');
    this.http.get<any>('http://localhost:8000/api/admin/submissions', {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    }).subscribe({
      next: (res) => this.submissions = res,
      error: (err) => console.error(err)
    });
  }

  updateStatus(id: number, status: string) {
    const token = localStorage.getItem('auth_token');
    this.http.put(`http://localhost:8000/api/admin/submissions/${id}`, 
      { status }, 
      { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
    ).subscribe({
      next: () => this.fetchSubmissions(),
      error: (err) => console.error(err)
    });
  }

  deleteSubmission(id: number) {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    const token = localStorage.getItem('auth_token');
    this.http.delete(`http://localhost:8000/api/admin/submissions/${id}`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    }).subscribe({
      next: () => this.submissions = this.submissions.filter(s => s.id !== id),
      error: (err) => console.error(err)
    });
  }

  logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  this.router.navigate(['/login']);
}


  toggleSidebar() {
    // Add logic if you need mobile sidebar toggle
  }
}
