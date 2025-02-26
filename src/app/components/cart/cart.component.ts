import { Component, computed, signal } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { SectionComponent } from '../core/section/section.component';
import { OrderService } from '../../services/order.service';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LocalCartItemModel } from '../../models/local-cart-item.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  imports: [SectionComponent, AsyncPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  items$!: Observable<LocalCartItemModel[]>;
  selected = signal<LocalCartItemModel[]>([]);
  subtotal = computed(() =>
    this.selected().reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    ),
  );
  tax = computed(() => this.subtotal() * 0.08);
  total = computed(() => this.subtotal() + this.tax());
  isUserLoggedIn = signal(false);

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    protected router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.items$ = this.cartService.items$;
    this.isUserLoggedIn.set(this.authService.isLoggedIn());
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
        this.router.navigate(['/order/success']);
      });
  }

  async onSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    const index = input.dataset['index'] ? Number(input.dataset['index']) : -1;
    const items = await firstValueFrom(this.items$);

    if (input.checked) {
      this.selected.update((val) => [...val, items[index]]);
      return;
    }

    this.selected.update((val) => {
      return val.filter((v, i) => {
        return v !== items[index];
      });
    });
  }
}
