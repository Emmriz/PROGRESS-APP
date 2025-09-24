import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LearnerGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role === 'learner') {
        return true; // ✅ allow access
      }
    }

    // ❌ not learner → send to mentor dashboard (or login)
    this.router.navigate(['/mentor-dashboard']);
    return false;
  }
}
