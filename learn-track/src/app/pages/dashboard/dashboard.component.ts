import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgClass, NgFor, NgIf, DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgClass, NgFor, NgIf, DatePipe], // ✅ full imports
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  user = { name: 'Emmanuel' }; // Later: load from API
  submissions: any[] = [
    { notes: 'Fixed bug in API', created_at: new Date(), status: 'approved' },
    { notes: 'UI update request', created_at: new Date(), status: 'pending' },
    { notes: 'Server crash report', created_at: new Date(), status: 'rejected' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // TODO: Fetch submissions from Laravel API
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    alert('Sidebar toggle not yet implemented 😅');
  }
}
