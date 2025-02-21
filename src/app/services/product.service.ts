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

  createProduct(
    name: string,
    price: number,
    description: string,
    tagline: string,
    images: File[],
  ) {
    const formData = new FormData();
    formData.append('name', name!);
    formData.append('price', price.toString());
    formData.append('description', description!);
    formData.append('tagline', tagline!);

    for (const imageFile of images) {
      formData.append('images[]', imageFile);
    }

    return this.http.post(`${environment.apiUrl}/products`, formData);
  }
}
