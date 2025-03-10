import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardComponent } from './product-card.component';
import { provideRouter } from '@angular/router';
import { ProductModel } from '../../../models/product.model';
import { ProductCategory } from '../../../enums/product-category';
import { ModalService } from '../../../services/modal.service';
import { CartService } from '../../../services/cart.service';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let productMock: ProductModel;
  let modalServiceMock: jasmine.SpyObj<ModalService>;
  let cartServiceMock: jasmine.SpyObj<CartService>;

  beforeEach(async () => {
    productMock = {
      id: -1,
      created_at: new Date(),
      updated_at: new Date(),
      description: '',
      name: 'balls',
      image_urls: ['https://loreflickr.com/123/123'],
      price: 1,
      rating: {
        total_rating: 1,
        total_star: 1,
      },
      tagline: '',
      category: ProductCategory.MEN,
      sum_rating: 1,
    };

    modalServiceMock = jasmine.createSpyObj<ModalService>('ModalService', [
      'openModal',
      'closeCurrentModal',
    ]);

    cartServiceMock = jasmine.createSpyObj<CartService>('CartService', [
      'addItem',
    ]);

    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [
        provideRouter([]),
        {
          provide: ModalService,
          useValue: modalServiceMock,
        },
        {
          provide: CartService,
          useValue: cartServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', productMock);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open a modal', () => {
    component.openModalCart();
    expect(modalServiceMock.openModal).toHaveBeenCalled();
  });
  it('should increase cart amount', () => {
    expect(component.addToCartAmount.value).toEqual(1);
    component.increaseCartAmount();
    expect(component.addToCartAmount.value).toEqual(2);
  });
  it('should decrease cart amount', () => {
    component.addToCartAmount.setValue(3);
    expect(component.addToCartAmount.value).toEqual(3);
    component.decreaseCartAmount();
    expect(component.addToCartAmount.value).toEqual(2);
  });
  it('should add product to cart', () => {
    component.onAddToCart();
    expect(modalServiceMock.closeCurrentModal).toHaveBeenCalled();
    expect(cartServiceMock.addItem).toHaveBeenCalled();
    expect(cartServiceMock.addItem).toHaveBeenCalledWith(productMock, 1);
  });
});
