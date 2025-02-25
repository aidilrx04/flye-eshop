import { Component, input } from '@angular/core';
import { NavItemModel } from '../../nav-item/nav-item.model';
import { NavItemComponent } from "../../nav-item/nav-item.component";

@Component({
  selector: 'app-dashboard-layout',
  imports: [NavItemComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
})
export class DashboardLayoutComponent {
  navItems = input<NavItemModel[]>([]);
}
