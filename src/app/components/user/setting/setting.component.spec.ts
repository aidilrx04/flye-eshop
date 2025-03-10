import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingComponent } from './setting.component';
import { AuthService } from '../../../services/auth.service';
import { UserModel } from '../../../models/user.model';
import { of } from 'rxjs';

describe('SettingComponent', () => {
  let component: SettingComponent;
  let fixture: ComponentFixture<SettingComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'user$',
      'getUser',
      'updateCurrentUser',
    ]);

    await TestBed.configureTestingModule({
      imports: [SettingComponent],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingComponent);
    component = fixture.componentInstance;

    // Mock User Data
    const mockUser: UserModel = {
      id: 1,
      full_name: 'John Doe',
      email: 'john@example.com',
    } as any;
    mockAuthService.getUser.and.returnValue(mockUser);
    mockAuthService.user$ = of(mockUser);
    mockAuthService.updateCurrentUser.and.returnValue(of(null as any));

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with user’s full name', () => {
    expect(component.updateUserGroup.controls.full_name.value).toBe('John Doe');
  });

  it('should show an alert if form is invalid when submitting', () => {
    spyOn(window, 'alert');
    component.updateUserGroup.controls.full_name.setValue('');
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Full name is required');
  });

  it('should show an alert if passwords don’t match', () => {
    spyOn(window, 'alert');
    component.updateUserGroup.controls.password.setValue('password123');
    component.updateUserGroup.controls.passwordConfirmation.setValue(
      'wrongPass',
    );
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith(
      'Password confirmation is not match',
    );
  });

  it('should call updateCurrentUser() when valid data is submitted', () => {
    spyOn(window, 'alert');
    component.updateUserGroup.controls.full_name.setValue('John Updated');
    component.updateUserGroup.controls.password.setValue('password123');
    component.updateUserGroup.controls.passwordConfirmation.setValue(
      'password123',
    );

    component.onSubmit();

    expect(mockAuthService.updateCurrentUser).toHaveBeenCalledWith({
      full_name: 'John Updated',
      password: 'password123',
    });
    expect(window.alert).toHaveBeenCalledWith('Profile updated');
  });
});
