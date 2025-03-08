import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleProductComponent } from './single-product.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ProductModel } from '../../models/product.model';
import { generateProductModel } from '../../../tests/helpers/generate-product-model';
import { of } from 'rxjs';

describe('SingleProductComponent', () => {
  let component: SingleProductComponent;
  let fixture: ComponentFixture<SingleProductComponent>;
  let productServiceMock: jasmine.SpyObj<ProductService>;
  let cartServiceMock: jasmine.SpyObj<CartService>;
  let productMock: ProductModel;

  beforeEach(async () => {
    productMock = generateProductModel();
    productServiceMock = jasmine.createSpyObj<ProductService>(
      'ProductService',
      ['getProduct'],
    );

    cartServiceMock = jasmine.createSpyObj<CartService>('CartService', [
      'addItem',
    ]);

    await TestBed.configureTestingModule({
      imports: [SingleProductComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ProductService,
          useValue: productServiceMock,
        },
        {
          provide: CartService,
          useValue: cartServiceMock,
        },
      ],
    }).compileComponents();

    productServiceMock.getProduct.and.returnValue(of(productMock));

    fixture = TestBed.createComponent(SingleProductComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('productId', 1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch a product', () => {
    component.product$.subscribe((product) => {
      expect(product).toBeTruthy();
      expect(product.name).toEqual(productMock.name);
    });

    expect(productServiceMock.getProduct).toHaveBeenCalledTimes(1);
    expect(productServiceMock.getProduct).toHaveBeenCalledWith(1);
  });
  it('should increase amount control', () => {
    expect(component.amount.value).toEqual(1);
    component.onIncrease();
    expect(component.amount.value).toEqual(2);
  });
  it('should decrease amount control', () => {
    component.amount.setValue(3);
    expect(component.amount.value).toEqual(3);
    component.onDecrease();
    expect(component.amount.value).toEqual(2);
  });
  it('should add an item to cart', async () => {
    await component.onAddToCart();
    expect(cartServiceMock.addItem).toHaveBeenCalledTimes(1);
    expect(cartServiceMock.addItem).toHaveBeenCalledWith(productMock, 1);
  });
});
