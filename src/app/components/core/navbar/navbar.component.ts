import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { NavItemModel } from '../nav-item/nav-item.model';
import { NavItemType } from '../nav-item/nav-item-type';
import { UserRole } from '../../../enums/user-role';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(
    private authService: AuthService,
    private cartService: CartService,
  ) {}

  navItems: {
    guest: NavItemModel[];
    user: NavItemModel[];
    admin: NavItemModel[];
  } = {
    guest: [
      {
        label: 'Sign In',
        type: NavItemType.LINK,
        href: '/signin',
      },
      {
        label: 'Sign Up',
        type: NavItemType.LINK,
        href: '/signup',
      },
    ],
    user: [
      {
        label: 'Profile',
        type: NavItemType.LINK,
        href: '/profile',
      },
      {
        label: 'Sign Out',
        type: NavItemType.LINK,
        href: '/signout',
      },
    ],
    admin: [
      {
        label: 'Admin',
        type: NavItemType.LINK,
        href: '/admin',
      },
      {
        label: 'Sign Out',
        type: NavItemType.LINK,
        href: '/signout',
      },
    ],
  };

  Role = UserRole;

  hasLoggedIn = false;
  itemInCartAmount = 0;
  role: UserRole | undefined = undefined;

  ngOnInit() {
    this.hasLoggedIn = this.authService.isLoggedIn();
    this.role = this.authService.getUser()?.role;

    this.cartService.items$.subscribe((value) => {
      this.itemInCartAmount = value.length;
    });
  }
}
