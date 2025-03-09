import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupComponent } from './signup.component';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let routerMock: jasmine.SpyObj<Router>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    routerMock = jasmine.createSpyObj<Router>('Router', ['navigate']);
    authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', [
      'signUp',
    ]);

    authServiceMock.signUp.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [SignupComponent],
      providers: [
        provideRouter([]),
        // {
        //   provide: Router,
        //   useValue: routerMock,
        // },
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not signed up if form is not filled', () => {
    component.onSubmit();
    expect(authServiceMock.signUp).toHaveBeenCalledTimes(0);
  });
  it('should not signed up if email is invalid', () => {
    component.signupForm.setValue({
      email: 'invalid email',
      fullName: 'Test Full Name',
      password: '123',
      passwordConfirmation: '123',
    });

    component.onSubmit();
    expect(authServiceMock.signUp).toHaveBeenCalledTimes(0);
  });
  it('should not sign up if password is not matched', () => {
    component.signupForm.setValue({
      email: 'test@example.com',
      fullName: 'Test Full Name',
      password: '123',
      passwordConfirmation: '321',
    });

    component.onSubmit();
    expect(authServiceMock.signUp).toHaveBeenCalledTimes(0);
  });
  it('should sign a user up and navigate to sign in page', (done) => {
    const formValue = {
      email: 'test@example.com',
      fullName: 'Test Full Name',
      password: 'password123',
      passwordConfirmation: 'password123',
    };
    spyOn(router, 'navigate');

    component.signupForm.setValue(formValue);
    component.onSubmit();

    setTimeout(() => {
      expect(authServiceMock.signUp).toHaveBeenCalled();
      expect(authServiceMock.signUp).toHaveBeenCalledWith(
        formValue.email,
        formValue.fullName,
        formValue.password,
      );

      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/signin']);
      done();
    });
  });
});
