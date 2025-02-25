import { OrderModel } from './order.model';
import { UserModel } from './user.model';

export interface OrderWithUserModel extends OrderModel {
  user: UserModel;
}
