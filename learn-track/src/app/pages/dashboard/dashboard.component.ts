import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgIf, NgForOf, NgClass } from '@angular/common';

interface Submission {
  id: number;
  notes: string;
  created_at: string;
  status: 'approved' | 'pending' | 'rejected';
  screenshot_path?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, NgIf, NgForOf, NgClass, DatePipe],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  user: any = null;
  submissions: Submission[] = [];

  approvedCount: number = 0;
  pendingCount: number = 0;
  rejectedCount: number = 0;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadSubmissions();
  }

  loadUser() {
    const userData = localStorage.getItem('user');
    this.user = userData ? JSON.parse(userData) : null;
  }

  loadSubmissions() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.http
      .get<{ data: Submission[] }>('http://localhost:8000/api/submissions', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe((res) => {
        this.submissions = res.data.map((sub) => ({
          ...sub,
          status: (sub.status as 'approved' | 'pending' | 'rejected') || 'pending',
        }));

        this.approvedCount = this.submissions.filter((s) => s.status === 'approved').length;
        this.pendingCount = this.submissions.filter((s) => s.status === 'pending').length;
        this.rejectedCount = this.submissions.filter((s) => s.status === 'rejected').length;
      });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    // Optional: implement responsive sidebar toggle
  }
}
