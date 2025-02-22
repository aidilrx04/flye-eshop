import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItemModel } from '../../models/cart-item.model';
import { SectionComponent } from "../core/section/section.component";

@Component({
  selector: 'app-cart',
  imports: [SectionComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  items!: CartItemModel[];

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.items = this.cartService.items;

    console.log(this.items);
  }
}
