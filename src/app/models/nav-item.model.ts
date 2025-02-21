import { NavItemType } from '../components/core/nav-item/nav-item-type';

export interface NavItemModel {
  type: NavItemType;
  href?: string;
  label: string;
  icon?: string;
}
