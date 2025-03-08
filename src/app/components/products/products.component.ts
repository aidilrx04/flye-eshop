import { Component, signal } from '@angular/core';
import { SectionComponent } from '../core/section/section.component';
import { HeroComponent } from '../core/hero/hero.component';
import { ProductCardComponent } from '../core/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import {
  BehaviorSubject,
  catchError,
  concat,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { ProductModel } from '../../models/product.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Link, Meta } from '../../models/api-response-paginate.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductCategory } from '../../enums/product-category';
import { LoadingPipe, ObsState, ObsWithState } from '../../pipes/loading.pipe';
import { emptyMeta } from '../../utils/empty-meta';
import { LoadingComponent } from '../core/loading/loading.component';
import { ErrorComponent } from '../core/error/error.component';

@Component({
  selector: 'app-products',
  imports: [
    SectionComponent,
    HeroComponent,
    ProductCardComponent,
    AsyncPipe,
    RouterLink,
    CommonModule,
    LoadingPipe,
    LoadingComponent,
    ErrorComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
  ) {}

  products$!: Observable<ObsWithState<ProductModel[]>>;

  pageSubject = new BehaviorSubject<Meta>(emptyMeta());
  pageMeta$ = this.pageSubject.asObservable();

  categoryLabel = signal('Explore Our Products');

  ngOnInit() {
    // const productsWithMeta$ = this.route.queryParamMap.pipe(
    //   tap((value) => {
    //     const queryCategory = value.get('category') ?? '';
    //     if (queryCategory in ProductCategory) {
    //       this.categoryLabel.set(
    //         Object(ProductCategory)[queryCategory].toLowerCase(),
    //       );
    //     }
    //   }),
    //   switchMap((param) => {
    //     return this.productService
    //       .getProducts({
    //         page: Number(param.get('page')) ?? 1,
    //         filter: {
    //           category:
    //             Object(ProductCategory)[param.get('category') ?? ''] ?? '',
    //         },
    //       })
    //       .pipe(shareReplay(1));
    //   }),
    // );
    // this.products$ = productsWithMeta$.pipe(map((v) => v.data));
    // this.pageMeta$ = productsWithMeta$.pipe(map((v) => v.meta));

    this.products$ = this.route.queryParamMap.pipe(
      tap((value) => {
        const queryCategory = value.get('category') ?? '';
        console.log('hello');
        if (queryCategory in ProductCategory) {
          this.categoryLabel.set(
            Object(ProductCategory)[queryCategory].toLowerCase(),
          );
        }
      }),
      switchMap((params) => {
        return concat(
          of({ type: ObsState.START }),
          this.productService
            .getProducts({
              page: Number(params.get('page')) ?? 1,
              filter: {
                category:
                  Object(ProductCategory)[params.get('category') ?? ''] ?? '',
              },
            })
            .pipe(
              tap((value) => {
                this.pageSubject.next(value.meta);
              }),
              map((value) => ({ type: ObsState.FINISH, data: value.data })),
              catchError((err) => {
                return of({
                  type: ObsState.ERROR,
                  error: {
                    message: 'Failed to get data',
                  },
                });
              }),
            ),
        );
      }),
    );
  }

  isNumberLink(link: Link) {
    return isNaN(Number(link.label)) === false;
  }
}
