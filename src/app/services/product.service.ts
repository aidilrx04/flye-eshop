import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ProductModel } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get<ProductModel[]>(`${environment.apiUrl}/products`);
  }

  getProduct(productId: number) {
    return this.http.get<ProductModel>(
      `${environment.apiUrl}/products/${productId}`,
    );
  }
}
