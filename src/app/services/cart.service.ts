import { Injectable } from '@angular/core';
import { ProductModel } from '../models/product.model';
import { BehaviorSubject } from 'rxjs';
import { LocalCartItemModel } from '../models/local-cart-item.model';

@Injectable({
  providedIn: 'root',
})
export abstract class CartService {
  protected keyName = 'flye-cart';
  protected itemsSubject: BehaviorSubject<LocalCartItemModel[]> =
    new BehaviorSubject<LocalCartItemModel[]>([]);
  items$ = this.itemsSubject.asObservable();

  public abstract addItem(product: ProductModel, quantity: number): void;
  public abstract removeItem(item: LocalCartItemModel): void;
}
