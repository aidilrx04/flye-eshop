import { NavItemType } from './nav-item-type';

export interface NavItemModel {
  type: NavItemType;
  href?: string;
  label: string;
  icon?: string;
}
