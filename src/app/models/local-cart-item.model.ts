import { CartItemModel } from './cart-item.model';
import { ProductModel } from './product.model';

export type LocalCartItemModel = Partial<CartItemModel> & {
  quantity: number;
  product: ProductModel;
};
