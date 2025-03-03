import { Component, input, signal, viewChildren } from '@angular/core';
import { NavItemModel } from '../../nav-item/nav-item.model';
import { NavItemComponent } from '../../nav-item/nav-item.component';
import { RouterLink } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { NavItemType } from '../../nav-item/nav-item-type';
import { filter, Observable } from 'rxjs';
import { UserModel } from '../../../../models/user.model';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  imports: [NavItemComponent, RouterLink, CommonModule, AsyncPipe],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
})
export class DashboardLayoutComponent {
  constructor(private authService: AuthService) {}

  navItems = input<NavItemModel[]>([]);
  signOutNavItem: NavItemModel = {
    type: NavItemType.LINK,
    label: 'Sign Out',
    icon: 'ph ph-sign-out',
    href: '/signout',
  };

  isNavOpen = signal(false);
  navItemRefs = viewChildren(NavItemComponent);
  user$!: Observable<UserModel>;

  ngOnInit() {
    this.user$ = this.authService.user$.pipe(filter((v) => v !== null));
  }

  ngAfterViewInit() {
    for (const navItem of this.navItemRefs()) {
      navItem.linkRef()?.nativeElement.addEventListener('click', () => {
        this.isNavOpen.set(false);
      });
    }
  }

  toggleNav() {
    this.isNavOpen.update((nav) => !nav);
  }
}
