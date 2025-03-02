import { Component } from '@angular/core';
import { ProductModel } from '../../../models/product.model';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DropdownComponent } from '../../core/dropdown/dropdown.component';
import { DropdownItemComponent } from '../../core/dropdown-item/dropdown-item.component';
import { PagingComponent } from '../../core/paging/paging.component';
import { MetaService } from '../../../services/meta.service';

@Component({
  selector: 'admin-products',
  imports: [
    AsyncPipe,
    CommonModule,
    RouterLink,
    DropdownComponent,
    DropdownItemComponent,
    PagingComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private metaService: MetaService,
  ) {}

  private productSubject = new BehaviorSubject<ProductModel[]>([]);
  products$ = this.productSubject.asObservable();

  ngOnInit() {
    this.route.queryParamMap
      .pipe(
        switchMap((params) =>
          this.productService.getProducts({
            page: Number(params.get('page')) ?? 1,
          }),
        ),
      )
      .subscribe((value) => {
        this.productSubject.next(value.data);
        this.metaService.setMeta(value.meta);
      });

    this.products$.subscribe((value) => {
      console.log(value);
    });
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
