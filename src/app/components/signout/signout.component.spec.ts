import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignoutComponent } from './signout.component';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

describe('SignoutComponent', () => {
  let component: SignoutComponent;
  let fixture: ComponentFixture<SignoutComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', [
      'signOut',
    ]);
    await TestBed.configureTestingModule({
      imports: [SignoutComponent],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignoutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sign user out and redirect to sign in page', (done) => {
    authServiceMock.signOut.and.returnValue(of(true));

    const windowStub = {
      location: {
        assign(val: string) {},
      },
    };

    spyOn(windowStub.location, 'assign');
    
    (component as any).window = windowStub;

    fixture.detectChanges();

    setTimeout(() => {
      expect(authServiceMock.signOut).toHaveBeenCalled();
      expect(windowStub.location.assign).toHaveBeenCalled();
      expect(windowStub.location.assign).toHaveBeenCalledTimes(1);
      expect(windowStub.location.assign).toHaveBeenCalledWith('/signin');
      done();
    });
  });
});
