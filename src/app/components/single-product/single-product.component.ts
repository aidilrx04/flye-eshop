import { Component, Input, signal } from '@angular/core';
import { NavbarComponent } from '../core/navbar/navbar.component';
import { SectionComponent } from '../core/section/section.component';
import { FooterComponent } from '../core/footer/footer.component';
import { HeroComponent } from '../core/hero/hero.component';
import { firstValueFrom, Observable } from 'rxjs';
import { ProductModel } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { currency } from '../../utils/currency';

@Component({
  selector: 'app-single-product',
  imports: [SectionComponent, HeroComponent, AsyncPipe, ReactiveFormsModule],
  templateUrl: './single-product.component.html',
  styleUrl: './single-product.component.css',
})
export class SingleProductComponent {
  constructor(
    private productService: ProductService,
    private cartService: CartService,
  ) {}

  fcurrency = currency;

  product$!: Observable<ProductModel>;

  amount = new FormControl(1);

  @Input()
  set productId(productId: number) {
    this.product$ = this.productService.getProduct(productId);
  }

  ngOnInit() {
    this.product$.subscribe((value) => {
      console.log(value);
    });
  }

  onIncrease() {
    // this.amount.update((v) => v + 1);
    this.amount.setValue(this.amount.value! + 1);
  }

  onDecrease() {
    // this.amount.update((v) => v - 1);
    this.amount.setValue(Math.max(this.amount.value! - 1, 1));
  }

  async onAddToCart() {
    const product = await firstValueFrom(this.product$);
    this.cartService.addItem(product, Number(this.amount.value));
  }
}
