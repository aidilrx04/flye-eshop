import { Component, signal } from '@angular/core';
import { SectionComponent } from '../core/section/section.component';
import { HeroComponent } from '../core/hero/hero.component';
import { faker } from '@faker-js/faker';
import { ProductCardComponent } from '../core/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { BehaviorSubject, map, Observable, shareReplay, switchMap } from 'rxjs';
import { ProductModel } from '../../models/product.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Link, Meta } from '../../models/api-response-paginate.model';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [
    SectionComponent,
    HeroComponent,
    ProductCardComponent,
    AsyncPipe,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
  ) {}

  products$!: Observable<ProductModel[]>;
  pageMeta$!: Observable<Meta>;

  ngOnInit() {
    const productsWithMeta$ = this.route.queryParamMap.pipe(
      switchMap((param) => {
        return this.productService
          .getProducts({
            page: Number(param.get('page')) ?? 1,
          })
          .pipe(shareReplay(1));
      }),
    );

    this.products$ = productsWithMeta$.pipe(map((v) => v.data));
    this.pageMeta$ = productsWithMeta$.pipe(map((v) => v.meta));
  }

  isNumberLink(link: Link) {
    return isNaN(Number(link.label)) === false;
  }
}
