import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIf, HttpClientModule, RouterModule], // imports needed for reactive forms, *ngIf, and HTTP
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string | null = null;
  loading = false;

  // Replace with your Laravel API URL
  apiUrl = 'http://localhost:8000/api/register';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.error = null;

    this.http.post<any>(this.apiUrl, this.registerForm.value).subscribe({
      next: (res) => {
        console.log('Registration success', res);
        // Optionally store token if returned
        if (res.token) {
          localStorage.setItem('token', res.token);
        }
        // Navigate to dashboard after registration
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.message || 'Registration failed';
        this.loading = false;
      },
    });
  }
}
