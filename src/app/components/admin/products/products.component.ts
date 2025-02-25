import { Component } from '@angular/core';
import { ProductModel } from '../../../models/product.model';
import { map, Observable, of } from 'rxjs';
import { faker } from '@faker-js/faker';
import { AsyncPipe, CommonModule } from '@angular/common';
import { NavItemComponent } from '../../core/nav-item/nav-item.component';
import { NavItemModel } from '../../core/nav-item/nav-item.model';
import { NavItemType } from '../../core/nav-item/nav-item-type';
import { ProductService } from '../../../services/product.service';
import { RouterLink } from '@angular/router';
import { DropdownComponent } from '../../core/dropdown/dropdown.component';
import { DropdownItemComponent } from '../../core/dropdown-item/dropdown-item.component';
import { ProductCategory } from '../../../enums/product-category';

@Component({
  selector: 'admin-products',
  imports: [
    AsyncPipe,
    CommonModule,
    RouterLink,
    DropdownComponent,
    DropdownItemComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  constructor(private productService: ProductService) {}

  products$!: Observable<ProductModel[]>;

  ngOnInit() {
    this.products$ = this.productService
      .getProducts()
      .pipe(map((value) => value.data));

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
        category: faker.helpers.arrayElement(
          Object.values(ProductCategory) as ProductCategory[],
        ),
      });
    }

    return result;
  }

  deleteProduct(productId: number) {
    this.productService.deleteProduct(productId).subscribe({
      next: (v) => {
        // ? maybe this is a bad idea
        this.products$ = this.productService
          .getProducts()
          .pipe(map((value) => value.data));
        alert('product deleted');
      },
      error: (err) => {
        alert('Failed to delete product' + err);
      },
    });
  }
}
