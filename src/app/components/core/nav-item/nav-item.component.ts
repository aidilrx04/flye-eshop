import { Component, ElementRef, input, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItemModel } from './nav-item.model';
import { NavItemType } from './nav-item-type';

@Component({
  selector: 'dashboard-nav-item',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.css',
})
export class NavItemComponent {
  item = input.required<NavItemModel>();

  linkRef = viewChild<ElementRef<HTMLAnchorElement> | undefined>('link');

  get isHeader() {
    return this.item().type === NavItemType.HEADER;
  }

  ngAfterViewInit() {
    // console.log(this.linkRef());
  }
}
