import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LocalCartService } from '../services/local-cart.service';
import { RemoteCartService } from '../services/remote-cart.service';

export function cartServiceFactory() {
  const authService = inject(AuthService);

  return authService.isLoggedIn()
    ? inject(RemoteCartService)
    : inject(LocalCartService);
}
