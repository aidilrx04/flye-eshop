import { Component, input, TemplateRef, ViewChild } from '@angular/core';
import { ProductModel } from '../../../models/product.model';
import { RouterLink } from '@angular/router';
import { ModalService } from '../../../services/modal.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  constructor(
    private modalService: ModalService,
    private cartService: CartService,
  ) {}

  product = input.required<ProductModel>();

  @ViewChild('cart', {
    read: TemplateRef,
  })
  cartModalTemplate!: TemplateRef<any>;

  addToCartAmount = new FormControl(1);

  openModalCart() {
    this.modalService.openModal(this.cartModalTemplate);
  }

  increaseCartAmount() {
    this.addToCartAmount.setValue(Number(this.addToCartAmount.value) + 1);
  }

  decreaseCartAmount() {
    this.addToCartAmount.setValue(
      Math.max(Number(this.addToCartAmount.value) - 1, 1),
    );
  }

  onAddToCart() {
    const amount = Number(this.addToCartAmount.value);

    this.cartService.addItem(this.product(), amount);
    this.modalService.closeCurrentModal();
  }
}
