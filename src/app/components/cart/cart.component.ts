import { Component, computed, inject, signal } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { SectionComponent } from '../core/section/section.component';
import { OrderService } from '../../services/order.service';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LocalCartItemModel } from '../../models/local-cart-item.model';
import { AuthService } from '../../services/auth.service';
import { RemoteCartService } from '../../services/remote-cart.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingComponent } from '../core/loading/loading.component';
import { currency } from '../../utils/currency';

@Component({
  selector: 'app-cart',
  imports: [
    SectionComponent,
    AsyncPipe,
    RouterLink,
    ReactiveFormsModule,
    LoadingComponent,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    protected router: Router,
    private authService: AuthService,
  ) {}

  private form = inject(FormBuilder);

  items$!: Observable<LocalCartItemModel[]>;
  selected = signal<LocalCartItemModel[]>([]);
  subtotal = computed(() =>
    this.selected().reduce(
      (acc, item) =>
        currency(acc + currency(item.product.price * item.quantity)),
      0,
    ),
  );
  tax = computed(() => currency(this.subtotal() * 0.08));
  total = computed(() => currency(this.subtotal() + this.tax()));
  isUserLoggedIn = signal(false);
  shippingAddress = this.form.control('', [Validators.required]);
  isCheckingOut = signal(false);

  tcurrency = currency;

  ngOnInit() {
    this.items$ = this.cartService.items$;
    this.isUserLoggedIn.set(this.authService.isLoggedIn());
  }

  onCheckout() {
    if (this.selected().length === 0) {
      alert('Please select an item');
      return;
    }

    if (this.shippingAddress.invalid) {
      alert('Please fill the shipping address');
      return;
    }

    this.isCheckingOut.set(true);
    this.orderService
      .createOrder({
        items: this.selected().map((v) => v.id!),
        shipping_address: this.shippingAddress.value!,
      })
      .subscribe((value) => {
        console.log(value);
        (this.cartService as RemoteCartService).refresh();
        // this.router.navigate(['/order/success']);
        // go to payment page
        window.location.href = value.payment.url;
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

  removeItem(item: LocalCartItemModel) {
    const confirmed = confirm('Remove this item from cart?');

    if (confirmed === false) return;

    this.cartService.removeItem(item);
  }
}
