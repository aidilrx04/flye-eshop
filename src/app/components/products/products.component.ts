import { Component, signal } from '@angular/core';
import { SectionComponent } from '../core/section/section.component';
import { HeroComponent } from '../core/hero/hero.component';
import { faker } from '@faker-js/faker';
import { ProductCardComponent } from '../core/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { Observable } from 'rxjs';
import { ProductModel } from '../../models/product.model';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [SectionComponent, HeroComponent, ProductCardComponent, AsyncPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  constructor(private productService: ProductService) {}

  // products = signal(this.generateProducts());

  // generateProducts(): Product[] {
  //   const amount = 9;

  //   const result = [];
  //   for (let i = 0; i < amount; i++) {
  //     const title = `${faker.commerce.productAdjective()} ${faker.commerce.product()}`;
  //     const price = Number(faker.commerce.price());
  //     const rating = faker.number.float({ min: 1, max: 2, fractionDigits: 1 });
  //     const imageUrl = faker.image.urlLoremFlickr();

  //     result.push(new Product(imageUrl, title, rating, price));
  //   }

  //   return result;
  // }

  products$!: Observable<ProductModel[]>;

  ngOnInit() {
    this.products$ = this.productService.getProducts();
  }
}
