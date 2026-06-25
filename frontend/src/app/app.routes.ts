import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'student',
    canActivate: [authGuard, roleGuard('student')],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/student/dashboard/dashboard.component').then(m => m.StudentDashboardComponent)
      },
      {
        path: 'scenario',
        loadComponent: () => import('./features/student/scenario-viewer/scenario-viewer.component').then(m => m.ScenarioViewerComponent)
      },
      {
        path: 'consequence',
        loadComponent: () => import('./features/student/consequence/consequence.component').then(m => m.ConsequenceComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/student/profile/profile.component').then(m => m.StudentProfileComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'teacher',
    canActivate: [authGuard, roleGuard('teacher')],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/teacher/dashboard/dashboard.component').then(m => m.TeacherDashboardComponent)
      },
      {
        path: 'student/:id',
        loadComponent: () => import('./features/teacher/student-detail/student-detail.component').then(m => m.StudentDetailComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard('admin')],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
