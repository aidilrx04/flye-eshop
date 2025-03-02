import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, map, switchMap } from 'rxjs';
import { UserRole } from '../enums/user-role';

export const ensureUserIsAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.initCompletedSubject.asObservable().pipe(
    filter((initCompleted) => initCompleted === true),
    switchMap(() => {
      return authService.user$.pipe(
        map((user) => {
          if (user !== null && user.role === UserRole.ADMIN) return true;

          router.navigate(['/']);

          return false;
        }),
      );
    }),
  );
};
