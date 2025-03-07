import { Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { HttpClient } from '@angular/common/http';
import { LocalCartItemModel } from '../models/local-cart-item.model';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { ProductModel } from '../models/product.model';
import { ApiResponseModel } from '../models/api-response.model';
import { CartItemModel } from '../models/cart-item.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RemoteCartService extends CartService {
  constructor(private http: HttpClient) {
    super();

    const stored = localStorage.getItem(this.keyName);
    const localItems = JSON.parse(stored ?? '[]') as LocalCartItemModel[];

    const request =
      localItems.length > 0
        ? this.syncCartItems(
            localItems.map((i) => ({
              quantity: i.quantity,
              product_id: i.product.id,
            })),
          )
        : new Observable((sb) => {
            sb.next([]);
            sb.complete();
          });

    request
      .pipe(
        catchError(() => of([] as CartItemModel[])),
        switchMap(() => this.getCartItems()),
      )
      .subscribe((value) => {
        localStorage.setItem(this.keyName, '[]');
        this.itemsSubject.next(value);
        console.log('remote cart service init completed');
      });
  }

  public override addItem(product: ProductModel, quantity: number): void {
    this.createItem(product, quantity).subscribe((value) => {
      this.refresh();
    });
  }
  createItem(product: ProductModel, quantity: number) {
    return this.http.post<ApiResponseModel<CartItemModel[]>>(
      `${environment.apiUrl}/carts`,
      {
        product_id: product.id,
        quantity,
      },
    );
  }
  public override removeItem(item: LocalCartItemModel): void {
    this.deleteItem(item.id!).subscribe(() => {
      this.refresh();
    });
  }
  deleteItem(itemId: number) {
    console.log('itemID', itemId);
    return this.http.delete(`${environment.apiUrl}/carts/${itemId}`);
  }

  private syncCartItems(
    localItems: { quantity: number; product_id: number }[],
  ) {
    return this.http.post<ApiResponseModel<CartItemModel[]>>(
      `${environment.apiUrl}/carts/bulkSave`,
      { items: localItems },
    );
  }

  private getCartItems() {
    console.log('geeting car items');
    return this.http
      .get<ApiResponseModel<CartItemModel[]>>(`${environment.apiUrl}/carts`)
      .pipe(map((value) => value.data));
  }

  refresh() {
    this.getCartItems().subscribe((value) => {
      this.itemsSubject.next(value);
    });
  }
}
