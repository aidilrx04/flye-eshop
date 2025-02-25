import { ProductCategory } from '../enums/product-category';

export interface ProductModel {
  id: number;
  name: string;
  price: number;
  rating: number;
  image_urls: string[];
  description: string;
  tagline: string;
  category: ProductCategory;
  created_at: Date;
  updated_at: Date;
}
