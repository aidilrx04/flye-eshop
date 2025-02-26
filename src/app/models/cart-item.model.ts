import { ProductModel } from './product.model';
import { UserModel } from './user.model';

export interface CartItemModel {
  id: number;
  quantity: number;
  product: ProductModel;
  product_id: number;
  user: UserModel;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}
