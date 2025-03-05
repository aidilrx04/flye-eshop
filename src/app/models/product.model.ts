import { ProductCategory } from '../enums/product-category';
import { RatingModel } from './rating.model';

export interface ProductModel {
  id: number;
  name: string;
  price: number;
  rating: RatingModel;
  sum_rating: number;
  image_urls: string[];
  description: string;
  tagline: string;
  category: ProductCategory;
  created_at: Date;
  updated_at: Date;
}
