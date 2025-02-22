import { Injectable } from '@angular/core';
import { ProductModel } from '../models/product.model';
import { CartItemModel } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor() {
    const stored = localStorage.getItem('flye-cart');
    this.items = stored ? JSON.parse(stored) : [];
  }

  items: CartItemModel[] = [];

  addProduct(product: ProductModel, quantity: number) {
    this.items.push({ product, quantity });

    this.saveCart();
  }

  removeProduct(product: ProductModel) {
    // this.items = this.items
    //   .slice(0, this.items.indexOf(product))
    //   .concat(this.items.slice(this.items.indexOf(product)));
  }

  private saveCart() {
    localStorage.setItem('flye-cart', JSON.stringify(this.items));
  }
}
