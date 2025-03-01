import { Component, input } from '@angular/core';
import { NavItemModel } from '../../nav-item/nav-item.model';
import { NavItemComponent } from '../../nav-item/nav-item.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  imports: [NavItemComponent, RouterLink],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
})
export class DashboardLayoutComponent {
  navItems = input<NavItemModel[]>([]);
}
