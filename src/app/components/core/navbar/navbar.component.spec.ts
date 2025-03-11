import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { UserRole } from '../../../enums/user-role';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isLoggedIn',
      'getUser',
    ]);
    cartServiceSpy = jasmine.createSpyObj('CartService', [], {
      items$: of([{ id: 1 }, { id: 2 }] as any),
    });

    TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set hasLoggedIn and role on init', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.getUser.and.returnValue({ role: UserRole.ADMIN } as any);

    component.ngOnInit();

    expect(component.hasLoggedIn).toBeTrue();
    expect(component.role).toBe(UserRole.ADMIN);
  });

  it('should update itemInCartAmount when cart changes', (done) => {
    // cartServiceSpy.items$ = of([{ id: 1 }, { id: 2 }] as any); // Simulating 2 items in cart
    // component.ngOnInit();
    fixture.detectChanges();

    setTimeout(() => {
      expect(component.itemInCartAmount).toBe(2);
      done();
    });
  });

  it('should toggle navigation state', () => {
    const initialState = component.isNavOpen();
    component.toggleNav();
    expect(component.isNavOpen()).toBe(!initialState);
  });

  it('should close nav when anchor tags are clicked', () => {
    spyOn(component.isNavOpen, 'set');

    component.ngAfterViewInit();
    // component.anchorTagRefs.set([
    //   { nativeElement: document.createElement('a') } as any,
    // ]);

    component.anchorTagRefs().forEach((elementRef) => {
      elementRef.nativeElement.click();
    });

    expect(component.isNavOpen.set).toHaveBeenCalledWith(false);
  });
});
