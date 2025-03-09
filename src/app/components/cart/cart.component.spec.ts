import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartComponent } from './cart.component';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { convertToParamMap, provideRouter, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { LocalCartItemModel } from '../../models/local-cart-item.model';
import { generateProductModel } from '../../../tests/helpers/generate-product-model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../../services/auth.service';
import { RemoteCartService } from '../../services/remote-cart.service';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartServiceMock: jasmine.SpyObj<CartService>;
  let orderServiceMock: jasmine.SpyObj<OrderService>;
  let cartItemsSubject: BehaviorSubject<LocalCartItemModel[]>;
  let cartItems: LocalCartItemModel[];
  beforeEach(async () => {
    cartItemsSubject = new BehaviorSubject<LocalCartItemModel[]>([]);

    cartServiceMock = jasmine.createSpyObj<RemoteCartService>(
      'CartService',
      ['removeItem', 'items$', 'refresh'],
      // {
      //   items$: cartItemsSubject.asObservable(),
      // },
    );

    orderServiceMock = jasmine.createSpyObj<OrderService>('OrderService', [
      'createOrder',
    ]);

    cartItems = [
      {
        quantity: 1,
        product: generateProductModel(),
      },
      {
        quantity: 2,
        product: generateProductModel(),
      },
    ];

    // cartItemsSubject.next(cartItems);
    cartServiceMock.items$ = of(cartItems);

    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: CartService,
          useValue: cartServiceMock,
        },
        {
          provide: OrderService,
          useValue: orderServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch list of items', async () => {
    component.items$.subscribe((items) => {
      expect(items).toEqual(cartItems);
    });
  });
  it('should calculate subtotal, tax, and total', () => {
    expect(component.subtotal()).toEqual(0);
    expect(component.tax()).toEqual(0);
    expect(component.total()).toEqual(0);

    component.selected.set([
      {
        quantity: 2,
        product: {
          ...generateProductModel(),
          price: 50,
        },
      },
      {
        quantity: 1,
        product: {
          ...generateProductModel(),
          price: 100,
        },
      },
    ]);

    expect(component.subtotal()).toEqual(200);
    expect(component.tax()).toEqual(200 * 0.08);
    expect(component.total()).toEqual(200 + 200 * 0.08);
  });
  it('should remove an item from cart', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    component.removeItem(cartItems[0]);

    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(cartServiceMock.removeItem).toHaveBeenCalledTimes(1);
    expect(cartServiceMock.removeItem).toHaveBeenCalledWith(cartItems[0]);
  });
  it('should prevent checkout when no item is selected', () => {
    spyOn(window, 'alert');
    component.selected.set([]);
    component.shippingAddress.setValue('');

    component.onCheckout();

    expect(alert).toHaveBeenCalledTimes(1);
  });
  it('should prevent checkout when shipping address is empty', () => {
    spyOn(window, 'alert');
    component.selected.set([cartItems[0]]);

    component.onCheckout();

    expect(alert).toHaveBeenCalledTimes(1);
    expect(alert).toHaveBeenCalledWith('Please fill the shipping address');
  });
  it('should create order on checkout', (done) => {
    // const a = spyOnProperty(window.location, 'href', 'set').and.returnValue();
    component.selected.set([cartItems[0]]);
    component.shippingAddress.setValue('Address');

    const mockResponse = { payment: { url: 'http://test.com' } };
    orderServiceMock.createOrder.and.returnValue(of(mockResponse as any));

    component.onCheckout();

    expect(orderServiceMock.createOrder).toHaveBeenCalledTimes(1);
    expect(orderServiceMock.createOrder).toHaveBeenCalledWith({
      items: [cartItems[0].id!],
      shipping_address: 'Address',
    });

    setTimeout(() => {
      // expect(window.location.href).toEqual(mockResponse.payment.url);
      done();
    });
  });
});
