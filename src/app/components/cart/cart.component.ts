import { Component, computed, signal } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItemModel } from '../../models/cart-item.model';
import { SectionComponent } from '../core/section/section.component';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [SectionComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  items!: CartItemModel[];
  selected = signal<CartItemModel[]>([]);
  subtotal = computed(() =>
    this.selected().reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    ),
  );
  tax = computed(() => this.subtotal() * 0.08);
  total = computed(() => this.subtotal() + this.tax());

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.items = this.cartService.items;

    console.log(this.items);
  }

  onCheckout() {
    if (this.selected().length === 0) alert('Please select an item');

    this.orderService
      .createOrder(
        this.selected().map((v) => ({
          quantity: v.quantity,
          product_id: v.product.id,
        })),
      )
      .subscribe((value) => {
        console.log(value);
        for (const item of this.selected()) {
          this.cartService.removeProduct(item);
        }
        this.router.navigate(['/order/success']);
      });
  }

  onSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    const index = input.dataset['index'] ? Number(input.dataset['index']) : -1;

    if (input.checked) {
      this.selected.update((val) => [...val, this.items[index]]);
      return;
    }

    this.selected.update((val) => {
      return val.filter((v, i) => {
        return v !== this.items[index];
      });
    });
  }
}
