import { ProductModel } from './product.model';

export interface CartItemModel {
  quantity: number;
  product: ProductModel;
}
