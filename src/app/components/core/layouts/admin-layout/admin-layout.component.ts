import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavItemModel } from '../../nav-item/nav-item.model';
import { NavItemType } from '../../nav-item/nav-item-type';
import { DashboardLayoutComponent } from '../dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, DashboardLayoutComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {
  navItems: NavItemModel[] = [
    {
      label: 'Dashboard',
      type: NavItemType.LINK,
      href: '/admin',
      icon: 'ph ph-house-simple',
    },
    {
      label: 'Products',
      type: NavItemType.HEADER,
    },
    {
      label: 'Create Product',
      type: NavItemType.LINK,
      href: '/admin/products/create',
      icon: 'ph ph-plus-square',
    },
    {
      label: 'All Products',
      type: NavItemType.LINK,
      href: '/admin/products',
      icon: 'ph ph-rows',
    },
    {
      label: 'All Orders',
      type: NavItemType.LINK,
      href: '/admin/orders',
      icon: 'ph ph-squares-four',
    },
  ];
}
