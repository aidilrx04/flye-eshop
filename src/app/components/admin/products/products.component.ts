import { Component } from '@angular/core';
import { ProductModel } from '../../../models/product.model';
import { Observable, of } from 'rxjs';
import { faker } from '@faker-js/faker';
import { AsyncPipe, CommonModule } from '@angular/common';
import { NavItemComponent } from '../../core/nav-item/nav-item.component';
import { NavItemModel } from '../../core/nav-item/nav-item.model';
import { NavItemType } from '../../core/nav-item/nav-item-type';

@Component({
  selector: 'admin-products',
  imports: [AsyncPipe, NavItemComponent, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  products$!: Observable<ProductModel[]>;
  

  ngOnInit() {
    this.products$ = of(this.generateProducts());

    this.products$.subscribe((value) => {
      console.log(value);
    });
  }

  generateProducts(): ProductModel[] {
    const amount = 10;

    const result: ProductModel[] = [];
    for (let i = 0; i < amount; i++) {
      const title = `${faker.commerce.productAdjective()} ${faker.commerce.product()}`;
      const price = Number(faker.commerce.price());
      const rating = faker.number.float({ min: 1, max: 2, fractionDigits: 1 });

      result.push({
        id: faker.number.int(),
        name: title,
        price: price,
        rating: rating,
        image_urls: [1, 1, 1].map(() => faker.image.urlLoremFlickr()),
        description: faker.word.words(20),
        tagline: faker.word.words(10),
        created_at: faker.date.anytime(),
        updated_at: faker.date.anytime(),
      });
    }

    return result;
  }
}
