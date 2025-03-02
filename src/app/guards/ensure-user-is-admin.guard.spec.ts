import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { ensureUserIsAdminGuard } from './ensure-user-is-admin.guard';

describe('ensureUserIsAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => ensureUserIsAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
