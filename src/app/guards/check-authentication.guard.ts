import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const checkAuthenticationGuard: CanActivateFn = (route, state) => {
  /**
   * Run Auth service initialization as first guard for all component
   */

  const authService = inject(AuthService);

  return authService.init().pipe(map(() => true));
};
