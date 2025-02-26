import { OrderStatus } from '../enums/order-status';
import { OrderItemModel } from './order-item.model';
import { PaymentModel } from './payment.model';

export interface OrderModel {
  id: number;
  user_id: number;
  total: number;
  shipping_address: string;
  status: OrderStatus;
  created_at: Date;
  updated_at: Date;
  items: OrderItemModel[];
  payment: PaymentModel;
}
