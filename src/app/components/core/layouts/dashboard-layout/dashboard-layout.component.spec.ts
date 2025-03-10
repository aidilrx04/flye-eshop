import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLayoutComponent } from './dashboard-layout.component';
import { AuthService } from '../../../../services/auth.service';
import { of } from 'rxjs';
import { NavItemComponent } from '../../nav-item/nav-item.component';
import { NavItemType } from '../../nav-item/nav-item-type';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('DashboardLayoutComponent', () => {
  let component: DashboardLayoutComponent;
  let fixture: ComponentFixture<DashboardLayoutComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['user$']);
    mockAuthService.user$ = of({ id: 1, full_name: 'John Doe' } as any); // Mock user data

    await TestBed.configureTestingModule({
      imports: [DashboardLayoutComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        provideRouter([]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user$ with authService.user$', () => {
    component.user$.subscribe((user) => {
      expect(user).toEqual({ id: 1, full_name: 'John Doe' } as any);
    });
  });

  it('should initialize signOutNavItem correctly', () => {
    expect(component.signOutNavItem).toEqual({
      type: NavItemType.LINK,
      label: 'Sign Out',
      icon: 'ph ph-sign-out',
      href: '/signout',
    });
  });

  it('should toggle isNavOpen when toggleNav() is called', () => {
    expect(component.isNavOpen()).toBe(false);

    component.toggleNav();
    expect(component.isNavOpen()).toBe(true);

    component.toggleNav();
    expect(component.isNavOpen()).toBe(false);
  });

  it('should close navigation when a nav item is clicked', () => {
    const navItem = component.navItemRefs()[0].linkRef()?.nativeElement!;
    const listenerSpy = spyOn(navItem, 'addEventListener');

    component.ngAfterViewInit();

    // Simulate click event
    const eventHandler = listenerSpy.calls.argsFor(0)[1];
    // console.log(eventHandler);
    component.isNavOpen.set(true);

    (eventHandler as any)();

    expect(component.isNavOpen()).toBe(false);
  });
});
