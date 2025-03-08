import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { ScrollService } from './services/scroll.service';
import { BehaviorSubject, of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;
  let scrollServiceMock: jasmine.SpyObj<ScrollService>;
  let initCompletedSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    initCompletedSubject = new BehaviorSubject(false);

    authServiceMock = jasmine.createSpyObj<AuthService>('AuthService', [], {
      initCompletedSubject,
    });

    routerMock = jasmine.createSpyObj<Router>('Router', ['events'], {
      events: of(new NavigationEnd(1, '/', '/')),
    });

    scrollServiceMock = jasmine.createSpyObj<ScrollService>('ScrollService', [
      'scrollToTop',
    ]);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
        {
          provide: ScrollService,
          useValue: scrollServiceMock,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should scroll to top when navigation end', () => {
    fixture.detectChanges();
    expect(scrollServiceMock.scrollToTop).toHaveBeenCalled();
  });
  it('should wait for init to complete', (done) => {
    fixture.detectChanges();
    expect(component.hasInitCompleted()).toBeFalsy();

    initCompletedSubject.next(true);

    setTimeout(() => {
      expect(component.hasInitCompleted()).toBeTruthy();
      done();
    });
  });

  // it(`should have the 'flye' title`, () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.componentInstance;
  //   // expect(app.title).toEqual('flye');
  // });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector('h1')?.textContent).toContain('Hello, flye');
  // });
});
