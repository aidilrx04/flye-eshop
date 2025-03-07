import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { ProductModel } from '../models/product.model';
import { ProductCategory } from '../enums/product-category';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  let mockProduct: ProductModel;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);

    httpMock = TestBed.inject(HttpTestingController);

    mockProduct = {
      id: 1,
      category: ProductCategory.MEN,
      name: 'Test Product',
      description: 'Test Product Description',
      price: 1,
      rating: {
        total_rating: 1,
        total_star: 1,
      },
      sum_rating: 1,
      created_at: new Date(0),
      updated_at: new Date(0),
      tagline: 'Test Tagline',
      image_urls: ['https://example.com'],
    };
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a list of products', () => {
    service.getProducts().subscribe((res) => {
      expect(res.data).toEqual([]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products?page=1`);
    expect(req.request.method).toEqual('GET');

    req.flush({ data: [], meta: {} });
  });

  it('should get a product', () => {
    service.getProduct(mockProduct.id).subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/products/${mockProduct.id}`,
    );
    expect(req.request.method).toEqual('GET');

    req.flush({ data: mockProduct });
  });

  it('should create a product', () => {
    const name = 'Test Product';
    const price = 1;
    const description = 'Test Description';
    const tagline = 'Test Tagline';

    service
      .createProduct(name, price, description, tagline, [])
      .subscribe((res) => {
        expect(res.name).toEqual(name);
        expect(res.price).toEqual(price);
        expect(res.tagline).toEqual(tagline);
        expect(res.description).toEqual(description);
      });

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    expect(req.request.method).toEqual('POST');

    req.flush({ data: { name, price, tagline, description } });
  });

  it('should delete a product', () => {
    service.deleteProduct(1).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/products/1`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
  it('should update a product', () => {
    const updateData = {
      name: 'New name',
      price: 2,
      description: 'New Description',
      tagline: 'New Tagline',
      newImages: [] as File[],
      removedImages: [],
    };

    service.updateProduct(1, updateData).subscribe((value) => {
      expect(value).toContain({
        name: updateData.name,
        price: updateData.price,
        description: updateData.description,
        tagline: updateData.tagline,
      });
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/products/1?_method=PUT`,
    );
    expect(req.request.method).toEqual('POST');
  });
});
