import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninComponent } from './signin.component';
import { AuthService } from '../../services/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', [
      'signIn',
      'isLoggedIn',
    ]);

    await TestBed.configureTestingModule({
      imports: [SigninComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should check if user has already signed in', () => {
    authServiceMock.isLoggedIn.and.returnValue(true);
    expect(component.hasLoggedIn).toBeFalse();
    fixture.detectChanges();
    expect(component.hasLoggedIn).toBeTruthy();
  });
  it('should check if not be able to sign in if email or password is not filled', () => {
    component.signinForm.setValue({
      email: '',
      password: '',
    });
    component.onSubmit();
    expect(authServiceMock.signIn).toHaveBeenCalledTimes(0);
  });
  it('should sign in a user', (done) => {
    component.signinForm.setValue({
      email: 'bob@mail.com',
      password: '123',
    });

    spyOn(localStorage, 'setItem');
    // spyOn(location, 'reload');
    let windowStub = {
      location: {
        reload() {},
      },
    };
    (component as any).window = windowStub;

    spyOn(windowStub.location, 'reload');

    authServiceMock.signIn.and.returnValue(of({ token: 'mockToken' }));

    component.onSubmit();

    setTimeout(() => {
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mockToken');

      expect(windowStub.location.reload).toHaveBeenCalled();

      done();
    });
  });
});
