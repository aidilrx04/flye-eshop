import { Component } from '@angular/core';
import { DashboardLayoutComponent } from '../dashboard-layout/dashboard-layout.component';
import { RouterOutlet } from '@angular/router';
import { NavItemModel } from '../../nav-item/nav-item.model';
import { NavItemType } from '../../nav-item/nav-item-type';

@Component({
  selector: 'app-user-layout',
  imports: [DashboardLayoutComponent, RouterOutlet],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css',
})
export class UserLayoutComponent {
  navItems: NavItemModel[] = [
    {
      type: NavItemType.HEADER,
      label: 'Profile',
    },
    {
      type: NavItemType.LINK,
      label: 'My Profile',
      icon: 'ph ph-user',
      href: '/profile',
    },
    {
      type: NavItemType.LINK,
      label: 'My Orders',
      icon: 'ph ph-squares-four',
      href: '/profile/orders',
    },
    {
      type: NavItemType.LINK,
      label: 'Setting',
      icon: 'ph ph-gear',
      href: '/profile/setting',
    },
  ];
}
