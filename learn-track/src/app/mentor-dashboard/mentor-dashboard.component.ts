import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf, NgClass } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Submission, SubmissionService } from '../services/submission.service';

@Component({
  selector: 'app-mentor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgFor, NgIf, NgClass, HttpClientModule],
  templateUrl: './mentor-dashboard.component.html',
  providers: [SubmissionService],
})
export class MentorDashboardComponent implements OnInit {
  submissions: Submission[] = [];
  pendingCount = 0;
  approvedCount = 0;
  viewMode: 'table' | 'cards' = 'table';
  sidebarOpen = false;
  loading = false;
  error = '';

  constructor(private router: Router, private submissionService: SubmissionService) {}

  ngOnInit(): void {
    this.fetchSubmissions();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  switchView(mode: 'table' | 'cards') {
    this.viewMode = mode;
  }

  fetchSubmissions(): void {
    this.loading = true;
    this.error = '';
    this.submissionService.getSubmissions().subscribe({
      next: (data) => {
        this.submissions = Array.isArray(data) ? data : [];
        this.calculateStats();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load submissions.';
        this.loading = false;
      }
    });
  }

  calculateStats() {
    this.pendingCount = this.submissions.filter(s => s.status === 'pending').length;
    this.approvedCount = this.submissions.filter(s => s.status === 'approved').length;
  }

  updateStatus(submission: Submission, status: 'pending' | 'approved' | 'rejected') {
    this.submissionService.updateSubmissionStatus(submission.id, status).subscribe({
      next: () => {
        submission.status = status;
        this.calculateStats();
      },
      error: () => alert('Error updating status')
    });
  }

  deleteSubmission(submission: Submission) {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    this.submissionService.deleteSubmission(submission.id).subscribe({
      next: () => {
        this.submissions = this.submissions.filter(s => s.id !== submission.id);
        this.calculateStats();
      },
      error: () => alert('Error deleting submission')
    });
  }

  // Track modal state
selectedImage: string | null = null;

// Open screenshot modal
openImage(path: string) {
  this.selectedImage = `http://localhost:8000/storage/${path}`;
}

// Close modal
closeImage() {
  this.selectedImage = null;
}


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
