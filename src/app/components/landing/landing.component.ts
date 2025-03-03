import { Component } from '@angular/core';
import { CarouselComponent } from '../core/carousel/carousel.component';
import { SectionComponent } from '../core/section/section.component';
import { ProductCardComponent } from '../core/product-card/product-card.component';
import { ProductModel } from '../../models/product.model';
import { ProductCategory } from '../../enums/product-category';
import { RouterLink } from '@angular/router';
import { catchError, map, Observable, of, switchMap, take } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { AsyncPipe } from '@angular/common';
import { LoadingPipe, ObsState, ObsWithState } from '../../pipes/loading.pipe';
import { ErrorComponent } from '../core/error/error.component';
import { LoadingComponent } from '../core/loading/loading.component';

@Component({
  selector: 'app-landing',
  imports: [
    CarouselComponent,
    SectionComponent,
    ProductCardComponent,
    RouterLink,
    AsyncPipe,
    LoadingPipe,
    ErrorComponent,
    LoadingComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  constructor(private productService: ProductService) {}

  men$!: Observable<ObsWithState<ProductModel[]>>;
  women$!: Observable<ObsWithState<ProductModel[]>>;
  kids$!: Observable<ObsWithState<ProductModel[]>>;

  footerData = {
    address: `Midvalley KL-Eco City, Kuala Lumpur`,
  };

  ngOnInit() {
    // console.log(this.firstCarousel);

    this.men$ = of({ type: ObsState.START }).pipe(
      switchMap(() =>
        this.productService
          .getProducts({
            filter: {
              category: ProductCategory.MEN,
            },
          })
          .pipe(
            take(12),
            map((value) => ({ type: ObsState.FINISH, data: value.data })),
            catchError((error) =>
              of({
                type: ObsState.ERROR,
                error: { message: 'Something went wrong' },
              }),
            ),
          ),
      ),
    );

    this.women$ = of({ type: ObsState.START }).pipe(
      switchMap(() =>
        this.productService
          .getProducts({
            filter: {
              category: ProductCategory.WOMEN,
            },
          })
          .pipe(
            take(12),
            map((value) => ({ type: ObsState.FINISH, data: value.data })),
            catchError((error) =>
              of({
                type: ObsState.ERROR,
                error: { message: 'Something went wrong' },
              }),
            ),
          ),
      ),
    );
    this.kids$ = of({ type: ObsState.START }).pipe(
      switchMap(() =>
        this.productService
          .getProducts({
            filter: {
              category: ProductCategory.KID,
            },
          })
          .pipe(
            take(12),
            map((value) => ({ type: ObsState.FINISH, data: value.data })),
            catchError((error) =>
              of({
                type: ObsState.ERROR,
                error: { message: 'Something went wrong' },
              }),
            ),
          ),
      ),
    );
  }
}
