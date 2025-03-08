import { TestBed } from '@angular/core/testing';

import { OrderService } from './order.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { PaymentStatus } from '../enums/payment-status';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(OrderService);

    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch list of orders', () => {
    service.getOrders().subscribe((orders) => {
      expect(orders.data).toBeInstanceOf(Array);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/orders`);
    expect(req.request.method).toEqual('GET');
    req.flush({ data: [] });
  });
  it('should fetch list of orders with query', () => {
    service
      .getOrders({
        page: 1,
        filter: {
          filter1: '123',
          filter2: '1233',
        },
        include: ['user'],
        sort: ['-name'],
      })
      .subscribe((items) => {
        expect(items.data).toBeInstanceOf(Array);
      });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/orders?page=1&sort=-name&filter[filter1]=123&filter[filter2]=1233&include=user`,
    );
    expect(req.request.method).toEqual('GET');
    req.flush({ data: [] });
  });
  it('should create an order', () => {
    const mockForm = {
      items: [1, 2, 3],
      shipping_address: 'Test Shipping Address',
    };
    service.createOrder(mockForm).subscribe((val) => {
      expect(val.items).toBeInstanceOf(Array);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/orders`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({
      items: mockForm.items,
      shipping_address: mockForm.shipping_address,
    });

    req.flush({ data: { items: [] } });
  });

  it('should fetch an order with user data', () => {
    service.getOrderWithUser(1).subscribe((order) => {
      expect(order.id).toEqual(1);
      expect(order.user).toBeTruthy();
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/orders/1?include=user`,
    );
    expect(req.request.method).toEqual('GET');
    req.flush({ data: { user: {}, id: 1 } });
  });
  it('should update an order payment status', () => {
    service.updatePaymentStatus(1, 1).subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/orders/status?status_id=1&order_id=1`,
    );
  });
  it('should update an order', () => {
    service
      .updateOrder(1, {
        total: 2,
      })
      .subscribe((newOrder) => {
        expect(newOrder.total).toEqual(2);
      });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/orders/1?_method=PUT`,
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({
      total: 2,
    });

    req.flush({ data: { total: 2 } });
  });
  it('should get an order', () => {
    service.getOrder(1).subscribe((order) => {
      expect(order).toBeTruthy();
      expect(order.id).toEqual(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/orders/${1}`);
    expect(req.request.method).toEqual('GET');
    req.flush({ data: { id: 1 } });
  });
});
