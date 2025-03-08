import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponseModel } from '../models/api-response.model';
import { OrderModel } from '../models/order.model';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';
import { OrderWithUserModel } from '../models/order-with-user.model';
import { APIResponsePaginateModel } from '../models/api-response-paginate.model';
import { QueryModel } from '../models/query.model';
import { QueryBuilder } from '../classes/query-builder';

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

  getOrders<M extends OrderModel = OrderModel>(query: QueryModel = {}) {
    const queryString = QueryBuilder.buildQueryParam(query);
    const toAppendQuery =
      queryString.trim().length > 0 ? `?${queryString}` : '';

    return this.http.get<APIResponsePaginateModel<M>>(
      `${environment.apiUrl}/orders${toAppendQuery}`,
    );
  }

  getOrderWithUser(orderId: number) {
    return this.http
      .get<
        ApiResponseModel<OrderWithUserModel>
      >(`${environment.apiUrl}/orders/${orderId}?include=user`)
      .pipe(map((value) => value.data));
  }

  updatePaymentStatus(statusId: number, orderId: number) {
    const params = new URLSearchParams();
    params.append('status_id', statusId.toString());
    params.append('order_id', orderId.toString());
    return this.http.post(
      `${environment.apiUrl}/orders/status?${params.toString()}`,
      null,
    );
  }

  updateOrder(orderId: number, newOrder: Partial<OrderModel>) {
    return this.http
      .post<
        ApiResponseModel<OrderModel>
      >(`${environment.apiUrl}/orders/${orderId}?_method=PUT`, newOrder)
      .pipe(map((value) => value.data));
  }

  getOrder(orderId: number) {
    return this.http
      .get<
        ApiResponseModel<OrderModel>
      >(`${environment.apiUrl}/orders/${orderId}`)
      .pipe(map((value) => value.data));
  }
}
