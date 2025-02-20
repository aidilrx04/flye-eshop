import { Component, input } from '@angular/core';
import { Product } from '../../../classes/product/product';
import { ProductModel } from '../../../models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  product = input.required<ProductModel>();
}
