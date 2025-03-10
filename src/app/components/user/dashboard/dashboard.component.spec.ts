import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { UserModel } from '../../../models/user.model';
import { of } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

describe('UserDashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['user$']);
    mockAuthService.user$ = of({
      id: 1,
      full_name: 'John Doe',
      email: 'john@example.com',
    } as any);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user$ with values from authService.user$', (done) => {
    component.user$.subscribe((user) => {
      expect(user).toEqual({
        id: 1,
        full_name: 'John Doe',
        email: 'john@example.com',
      } as UserModel);
      done();
    });
  });
});
