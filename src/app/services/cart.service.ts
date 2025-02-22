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

  removeProduct(item: CartItemModel) {
    this.items = this.items.filter((v) => v !== item);
    this.saveCart();
  }

  private saveCart() {
    localStorage.setItem('flye-cart', JSON.stringify(this.items));
  }

  clearCart() {
    this.items = [];
  }
}
