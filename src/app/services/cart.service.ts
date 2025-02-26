import { Injectable } from '@angular/core';
import { ProductModel } from '../models/product.model';
import { CartItemModel } from '../models/cart-item.model';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponseModel } from '../models/api-response.model';
import { environment } from '../../environments/environment';
import { LocalCartItemModel } from '../models/local-cart-item.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  keyName = 'flye-cart';

  private itemsSubject = new BehaviorSubject<LocalCartItemModel[]>([]);
  items$ = this.itemsSubject.asObservable();

  isUserLoggedIn = false;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) {
    this.isUserLoggedIn = authService.isLoggedIn();

    // get local data
    const stored = localStorage.getItem(this.keyName);
    const localItems = JSON.parse(stored ?? '[]') as LocalCartItemModel[];

    if (this.isUserLoggedIn === false) {
      // local only :(
      this.itemsSubject.next(localItems);
      this.items$.subscribe((value) => {
        localStorage.setItem(this.keyName, JSON.stringify(value));
      });
      return;
    }

    // sync local data

    const request =
      localItems.length > 0
        ? this.syncCartItems(
            localItems.map((item) => ({
              product_id: item.product.id,
              quantity: item.quantity,
            })),
          )
        : new Observable((sb) => sb.next([]));

    request
      .pipe(
        catchError(() => {
          // ignore any error from the request
          return [];
        }),
      )
      .subscribe(() => {
        // clear localStorage
        localStorage.removeItem(this.keyName);
        this.getCartItems()
          .pipe(
            catchError(() => {
              // ignore any error from the request
              console.warn('Failed to get cart items.');
              return [];
            }),
          )
          .subscribe((items) => {
            console.log(items);
            this.itemsSubject.next(items);
          });
      });
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
    return this.http
      .get<ApiResponseModel<CartItemModel[]>>(`${environment.apiUrl}/carts`)
      .pipe(map((value) => value.data));
  }

  addItem(product: ProductModel, quantity: number) {
    if (this.isUserLoggedIn === false) {
      this.itemsSubject.next([
        ...this.itemsSubject.value,
        {
          product,
          quantity,
        },
      ]);

      return;
    }

    this.createItem(product, quantity).subscribe((value) => {
      this.itemsSubject.next([...this.itemsSubject.value, value]);
    });
  }

  private createItem(product: ProductModel, quantity: number) {
    return this.http
      .post<ApiResponseModel<CartItemModel>>(`${environment.apiUrl}/carts`, {
        product_id: product.id,
        quantity,
      })
      .pipe(map((value) => value.data));
  }

  removeItem(item: LocalCartItemModel) {
    this.itemsSubject.next(this.itemsSubject.value.filter((i) => i !== item));
  }
}
