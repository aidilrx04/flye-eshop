import { Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { LocalCartItemModel } from '../models/local-cart-item.model';
import { ProductModel } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class LocalCartService extends CartService {
  constructor() {
    super();

    const stored = localStorage.getItem(this.keyName);
    const localItems = JSON.parse(stored ?? '[]') as LocalCartItemModel[];
    this.itemsSubject.next(localItems);
    this.items$.subscribe((value) => {
      localStorage.setItem(this.keyName, JSON.stringify(value));
    });
    console.log('local cart service init completed');
  }
  public override addItem(product: ProductModel, quantity: number): void {
    this.itemsSubject.next([
      ...this.itemsSubject.value,
      {
        product,
        quantity,
      },
    ]);
  }
  public override removeItem(item: LocalCartItemModel): void {
    this.itemsSubject.next(this.itemsSubject.value.filter((i) => i !== item));
  }
}
