import { UserRole } from '../enums/user-role';

export interface UserModel {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  email_verified_at: null;
  created_at: Date;
  updated_at: Date;
}
