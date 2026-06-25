import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRole: 'student' | 'teacher' | 'admin'): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const tokenPayload = authService.getDecodedToken();
    if (!tokenPayload) {
      router.navigate(['/login']);
      return false;
    }

    const userRole = tokenPayload.role;
    if (userRole === allowedRole) {
      return true;
    }

    // If role does not match, redirect to the real role's dashboard
    switch (userRole) {
      case 'student':
        router.navigate(['/student/dashboard']);
        break;
      case 'teacher':
        router.navigate(['/teacher/dashboard']);
        break;
      case 'admin':
        router.navigate(['/admin/dashboard']);
        break;
      default:
        router.navigate(['/login']);
    }
    return false;
  };
};
