import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

interface Submission {
  id: number;
  details: string;
  created_at: string;
  status: 'approved' | 'pending' | 'rejected';
  screenshot_path?: string;
}

@Component({
  selector: 'app-submission',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './submissions.component.html',
})
export class SubmissionComponent implements OnInit {
  user: any = null;
  submissions: Submission[] = [];

  details: string = '';
  selectedFile: File | null = null;
  filePreview: string | ArrayBuffer | null = null;

  uploading: boolean = false;

  message: string = '';
  messageType: 'success' | 'error' = 'success';

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
          status: sub.status || 'pending',
        }));
      });
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.selectedFile = input.files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      this.filePreview = e.target?.result ?? null;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  submitSubmission() {
    if (!this.details) {
      this.message = 'Please enter submission details.';
      this.messageType = 'error';
      return;
    }

    this.uploading = true;
    const token = localStorage.getItem('token');
    if (!token) return;

    const formData = new FormData();
    formData.append('details', this.details);
    if (this.selectedFile) formData.append('screenshot', this.selectedFile);

    this.http
      .post('http://localhost:8000/api/submissions', formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (res: any) => {
          this.message = res.message || 'Submission uploaded successfully.';
          this.messageType = 'success';
          this.details = '';
          this.selectedFile = null;
          this.filePreview = null;
          this.loadSubmissions();
          this.uploading = false;
        },
        error: (err) => {
          this.message = 'Error uploading submission.';
          this.messageType = 'error';
          this.uploading = false;
        },
      });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
