import { Component } from '@angular/core';
import { CarouselComponent } from '../core/carousel/carousel.component';
import { faker } from '@faker-js/faker';
import { SectionComponent } from '../core/section/section.component';
import { FooterComponent } from '../core/footer/footer.component';
import { NavbarComponent } from '../core/navbar/navbar.component';
import { ProductCardComponent } from '../core/product-card/product-card.component';
import { ProductModel } from '../../models/product.model';
import { ProductCategory } from '../../enums/product-category';
import { RouterLink } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-landing',
  imports: [
    CarouselComponent,
    SectionComponent,
    ProductCardComponent,
    RouterLink,
    AsyncPipe,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  constructor(private productService: ProductService) {}

  men$!: Observable<ProductModel[]>;
  women$!: Observable<ProductModel[]>;
  kids$!: Observable<ProductModel[]>;

  footerData = {
    address: `${faker.location.streetAddress({ useFullAddress: true })}, ${faker.location.city()}, ${faker.location.country()}`,
  };

  ngOnInit() {
    // console.log(this.firstCarousel);

    this.men$ = this.productService
      .getProducts({
        filter: {
          category: ProductCategory.MEN,
        },
      })
      .pipe(
        map((value) => value.data),
        take(12),
      );
    this.women$ = this.productService
      .getProducts({
        filter: {
          category: ProductCategory.WOMEN,
        },
      })
      .pipe(
        map((value) => value.data),
        take(12),
      );
    this.kids$ = this.productService
      .getProducts({
        filter: {
          category: ProductCategory.KID,
        },
      })
      .pipe(
        map((value) => value.data),
        take(12),
      );
  }
}
