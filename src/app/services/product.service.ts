import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ProductModel } from '../models/product.model';
import { map } from 'rxjs';
import { ApiResponseModel } from '../models/api-response.model';
import { APIResponsePaginateModel } from '../models/api-response-paginate.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http
      .get<ApiResponseModel<ProductModel[]>>(`${environment.apiUrl}/products`)
      .pipe(map((value) => value.data));
  }

  getProduct(productId: number) {
    return this.http
      .get<
        ApiResponseModel<ProductModel>
      >(`${environment.apiUrl}/products/${productId}`)
      .pipe(map((value) => value.data));
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

    return this.http
      .post<
        ApiResponseModel<ProductModel>
      >(`${environment.apiUrl}/products`, formData)
      .pipe(map((value) => value.data));
  }

  getProductsWithPage(page = 1) {
    return this.http.get<APIResponsePaginateModel<ProductModel>>(
      `${environment.apiUrl}/products?page=${page}`,
    );
  }

  deleteProduct(productId: number) {
    return this.http.delete<{ message: string }>(
      `${environment.apiUrl}/products/${productId}`,
    );
  }
}
