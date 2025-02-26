import { PaymentStatus } from '../enums/payment-status';

export interface PaymentModel {
  id: number;
  order_id: number;
  amount: number;
  method: string;
  url: string;
  status: PaymentStatus;
  valid_until: Date;
  created_at: Date;
  updated_at: Date;
}
