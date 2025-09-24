import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SubmissionComponent } from './pages/submissions/submissions.component';
import { AuthGuard } from './auth.guard';
import { MentorDashboardComponent } from './mentor-dashboard/mentor-dashboard.component';
import { AdminGuard } from './guards/admin.guard';
import { LearnerGuard } from './guards/learner.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [LearnerGuard] },
  { path: 'submissions', component: SubmissionComponent, canActivate: [LearnerGuard] },
  { path: 'mentor-dashboard', component: MentorDashboardComponent, canActivate: [AdminGuard] }, // ✅ Protect with guard
  // { path: '**', redirectTo: 'login' }, // catch-all fallback
  { path: '**', redirectTo: 'dashboard' } // if most users are learners
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
