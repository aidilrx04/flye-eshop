import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ProductModel } from '../models/product.model';
import { map, tap } from 'rxjs';
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

  updateProduct(
    productId: number,
    updatedData: {
      name: string;
      price: number;
      description: string;
      tagline: string;
      newImages: File[];
      removedImages: string[];
      newThumbnail?: File;
      setThumbnail?: string;
    },
  ) {
    const formData = new FormData();

    formData.append('name', updatedData.name);
    formData.append('price', updatedData.price.toString());
    formData.append('description', updatedData.description);
    formData.append('tagline', updatedData.tagline);
    if (updatedData.newThumbnail) {
      formData.append('new_thumbnail', updatedData.newThumbnail);
    }
    if (updatedData.setThumbnail) {
      formData.append('set_thumbnail', updatedData.setThumbnail);
    }

    for (const removedImage of updatedData.removedImages) {
      formData.append('remove_images[]', removedImage);
    }

    for (const newImage of updatedData.newImages) {
      formData.append('new_images[]', newImage);
    }

    /**
     * This is a workaround for form data not working with laravel put request
     */
    return this.http
      .post<
        ApiResponseModel<ProductModel>
      >(`${environment.apiUrl}/products/${productId}?_method=PUT`, formData)
      .pipe(
        tap((v) => console.log(v)),
        map((value) => value.data),
      );
  }
}
