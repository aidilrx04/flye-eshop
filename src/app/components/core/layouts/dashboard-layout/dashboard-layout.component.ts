import { Component, input, signal, viewChildren } from '@angular/core';
import { NavItemModel } from '../../nav-item/nav-item.model';
import { NavItemComponent } from '../../nav-item/nav-item.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-layout',
  imports: [NavItemComponent, RouterLink, CommonModule],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
})
export class DashboardLayoutComponent {
  navItems = input<NavItemModel[]>([]);

  isNavOpen = signal(false);
  navItemRefs = viewChildren(NavItemComponent);

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
