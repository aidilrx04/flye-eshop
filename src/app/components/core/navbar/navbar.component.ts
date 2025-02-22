import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';

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

  hasLoggedIn = false;
  itemInCartAmount = 0;

  ngOnInit() {
    this.hasLoggedIn = this.authService.isLoggedIn();

    this.itemInCartAmount = this.cartService.items.length;
  }
}
