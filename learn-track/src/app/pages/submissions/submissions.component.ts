import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

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
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './submissions.component.html',
})
export class SubmissionComponent implements OnInit {
  user: any = null;
  submissions: Submission[] = [];

  // New submission form
  details: string = '';
  selectedFile: File | null = null;
  filePreview: string | ArrayBuffer | null = null;
  uploading: boolean = false;

  // Messages
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  // Edit modal state
  showEditModal: boolean = false;
  editingId: number | null = null;
  editDetails: string = '';
  editSelectedFile: File | null = null;
  editFilePreview: string | ArrayBuffer | null = null;
  currentScreenshotPath: string | null = null; // existing image path for preview inside modal

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
      }, (err) => {
        console.error('Failed to load submissions', err);
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
          console.error(err);
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

  // ---------- Edit modal methods ----------

  openEditModal(submission: Submission) {
    this.editingId = submission.id;
    this.editDetails = submission.details;
    this.editSelectedFile = null;
    this.editFilePreview = null;
    this.currentScreenshotPath = submission.screenshot_path ?? null;
    this.showEditModal = true;
    this.message = '';
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingId = null;
    this.editDetails = '';
    this.editSelectedFile = null;
    this.editFilePreview = null;
    this.currentScreenshotPath = null;
  }

  handleEditFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.editSelectedFile = input.files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      this.editFilePreview = e.target?.result ?? null;
    };
    reader.readAsDataURL(this.editSelectedFile);
  }

  saveEdit() {
    if (this.editingId == null) return;

    if (!this.editDetails || this.editDetails.trim() === '') {
      this.message = 'Please provide details.';
      this.messageType = 'error';
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    // Use FormData and method override to support file upload on update.
    const fd = new FormData();
    fd.append('details', this.editDetails);
    if (this.editSelectedFile) fd.append('screenshot', this.editSelectedFile);
    fd.append('_method', 'PUT'); // method override for Laravel

    this.uploading = true;

    this.http.post(`http://localhost:8000/api/submissions/${this.editingId}`, fd, {
      headers: { Authorization: `Bearer ${token}` },
    }).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Submission updated successfully.';
        this.messageType = 'success';
        this.uploading = false;
        this.closeEditModal();
        this.loadSubmissions();
      },
      error: (err) => {
        console.error(err);
        this.message = 'Error updating submission.';
        this.messageType = 'error';
        this.uploading = false;
      },
    });
  }

  // ---------- Delete ----------
  deleteSubmission(id: number) {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    this.http
      .delete(`http://localhost:8000/api/submissions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (res: any) => {
          this.message = res.message || 'Submission deleted successfully.';
          this.messageType = 'success';
          // close modal if the deleted item was being edited
          if (this.editingId === id) this.closeEditModal();
          this.loadSubmissions();
        },
        error: (err) => {
          console.error(err);
          this.message = 'Error deleting submission.';
          this.messageType = 'error';
        },
      });
  }
}
