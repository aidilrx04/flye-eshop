import { TestBed } from '@angular/core/testing';

import { LocalCartService } from './local-cart.service';
import { LocalCartItemModel } from '../models/local-cart-item.model';
import { ProductCategory } from '../enums/product-category';
import { firstValueFrom } from 'rxjs';
import { ProductModel } from '../models/product.model';

describe('LocalCartService', () => {
  let service: LocalCartService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with items from localStorage', (done) => {
    const mockCart = [
      { product: { id: 1, name: 'Test Product' }, quantity: 2 },
    ] as any;
    localStorage.setItem('flye-cart', JSON.stringify(mockCart));

    const newService = new LocalCartService();
    newService.items$.subscribe((val) => {
      expect(val).toEqual(mockCart);
      done();
    });
  });

  it('should add item to cart', (done) => {
    const product: ProductModel = { id: 1, name: 'Product A' } as ProductModel;
    service.addItem(product, 1);

    service.items$.subscribe((value) => {
      expect(value.length).toBe(1);
      expect(value[0]).toEqual({ product, quantity: 1 });
      expect(localStorage.getItem('flye-cart')).toContain('Product A');
      done();
    });
  });

  it('should remove item from cart', () => {
    const product: ProductModel = { id: 1, name: 'Product A' } as ProductModel;
    service.addItem(product, 1);

    const item = (service as any).itemsSubject.value[0];
    service.removeItem(item);

    expect((service as any).itemsSubject.value.length).toBe(0);
    expect(localStorage.getItem('flye-cart')).toBe('[]');
  });
});
