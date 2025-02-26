import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponseModel } from '../models/api-response.model';
import { OrderModel } from '../models/order.model';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';
import { OrderWithUserModel } from '../models/order-with-user.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  createOrder(form: { items: number[]; shipping_address: string }) {
    return this.http
      .post<ApiResponseModel<OrderModel>>(`${environment.apiUrl}/orders`, form)
      .pipe(map((value) => value.data));
  }

  getOrders() {
    return this.http
      .get<ApiResponseModel<OrderModel[]>>(`${environment.apiUrl}/orders`)
      .pipe(map((value) => value.data));
  }

  getOrderWithUsers() {
    return this.http
      .get<
        ApiResponseModel<OrderWithUserModel[]>
      >(`${environment.apiUrl}/orders?include=user`)
      .pipe(map((value) => value.data));
  }

  getOrderWithUser(orderId: number) {
    return this.http
      .get<
        ApiResponseModel<OrderWithUserModel>
      >(`${environment.apiUrl}/orders/${orderId}?include=user`)
      .pipe(map((value) => value.data));
  }
}
