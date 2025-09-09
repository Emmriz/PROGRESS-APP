import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIf, HttpClientModule, RouterModule], // necessary imports
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string | null = null;
  loading = false;

  // Replace with your Laravel API URL
  apiUrl = 'http://localhost:8000/api/login';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = null;

    this.http.post<any>(this.apiUrl, this.loginForm.value).subscribe({
      next: (res) => {
        console.log('Login success', res);
        // Store token for authenticated API calls
        if (res.token) {
          localStorage.setItem('token', res.token);
        }
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.message || 'Login failed';
        this.loading = false;
      },
    });
  }
}
