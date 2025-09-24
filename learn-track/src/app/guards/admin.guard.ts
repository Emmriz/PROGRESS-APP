import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role === 'admin') {
        return true; // ✅ allow access
      }
    }

    // ❌ not admin → send to learner dashboard (or login)
    this.router.navigate(['/login']);
    return false;
  }
}



