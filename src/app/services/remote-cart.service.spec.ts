import { TestBed } from '@angular/core/testing';

import { RemoteCartService } from './remote-cart.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ProductModel } from '../models/product.model';
import { ProductCategory } from '../enums/product-category';
import { environment } from '../../environments/environment';
import { createLocalStorageMock } from '../../tests/helpers/local-storage.mock';
import { LocalCartItemModel } from '../models/local-cart-item.model';

describe('RemoteCartService', () => {
  let service: RemoteCartService;
  let httpMock: HttpTestingController;
  let productMock: ProductModel;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);

    productMock = {
      id: 1,
      category: ProductCategory.MEN,
      created_at: new Date(0),
      updated_at: new Date(0),
      description: '',
      image_urls: [],
      name: '',
      price: 1,
      rating: {
        total_rating: 1,
        total_star: 1,
      },
      sum_rating: 1,
      tagline: '',
    };

    const localStorageMock = createLocalStorageMock();
    const localStorageSpy = spyOnProperty(
      window,
      'localStorage',
      'get',
    ).and.returnValue(localStorageMock);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    service = TestBed.inject(RemoteCartService);
    expect(service).toBeTruthy();
    httpMock.expectOne(`${environment.apiUrl}/carts`);
  });

  it('should sync cart items in local storage', () => {
    localStorage.setItem(
      'flye-cart',
      JSON.stringify([{ quantity: 1, product: productMock }]),
    );
    service = TestBed.inject(RemoteCartService);

    const req = httpMock.expectOne(`${environment.apiUrl}/carts/bulkSave`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body.items).toContain({
      quantity: 1,
      product_id: productMock.id,
    });
    req.flush({ data: [{ quantity: 1, product: productMock }] });

    httpMock.expectOne(`${environment.apiUrl}/carts`);
  });

  it('should retrieve cart items from server', () => {
    service = TestBed.inject(RemoteCartService);

    const req = httpMock.expectOne(`${environment.apiUrl}/carts`);
    req.flush({ data: [{ quantity: 1, product: productMock }] });

    service.items$.subscribe((items) => {
      expect(items.length === 1).toBeTruthy();
      expect(items[0].quantity).toEqual(1);
      expect(items[0].product).toEqual(productMock);
    });
  });

  it('should add an item to server', () => {
    service = TestBed.inject(RemoteCartService);

    httpMock.expectOne(`${environment.apiUrl}/carts`);

    service.addItem(productMock, 2);

    const addReq = httpMock.expectOne(`${environment.apiUrl}/carts`);
    expect(addReq.request.method).toEqual('POST');
    expect(addReq.request.body).toEqual({
      product_id: productMock.id,
      quantity: 2,
    });
    addReq.flush({ data: { quantity: 2, product: productMock } });

    const refreshReq = httpMock.expectOne(`${environment.apiUrl}/carts`);
    refreshReq.flush({ data: [{ quantity: 2, product: productMock }] });

    service.items$.subscribe((items) => {
      expect(items.length === 1).toBeTruthy();
      expect(items[0].quantity).toEqual(2);
    });
  });

  it('should delete an item from server', () => {
    service = TestBed.inject(RemoteCartService);
    const localCartItem: LocalCartItemModel = {
      quantity: 2,
      product: productMock,
      id: 1,
    };

    const fetchReq = httpMock.expectOne(`${environment.apiUrl}/carts`);
    fetchReq.flush({ data: [localCartItem] });

    service.removeItem(localCartItem);

    const delReq = httpMock.expectOne(
      `${environment.apiUrl}/carts/${localCartItem.id}`,
    );

    expect(delReq.request.method).toEqual('DELETE');
    delReq.flush(null, { status: 204, statusText: 'No Content' });

    httpMock.expectOne(`${environment.apiUrl}/carts`);
  });
});
