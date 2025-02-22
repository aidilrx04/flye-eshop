import { OrderItemModel } from './order-item.model';

export interface OrderModel {
  id: number;
  total: number;
  created_at: Date;
  updated_at: Date;
  items: OrderItemModel[];
}
