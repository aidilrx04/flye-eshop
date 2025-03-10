import { TestBed } from '@angular/core/testing';

import { LocalCartService } from './local-cart.service';
import { LocalCartItemModel } from '../models/local-cart-item.model';
import { ProductCategory } from '../enums/product-category';
import { firstValueFrom } from 'rxjs';
import { ProductModel } from '../models/product.model';

describe('LocalCartService', () => {
  let service: LocalCartService;
  let data: LocalCartItemModel[];
  let productMock: ProductModel;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalCartService);

    productMock = {
      id: 1,
      category: ProductCategory.MEN,
      created_at: new Date(0),
      updated_at: new Date(0),
      description: '',
      image_urls: [],
      name: '',
      price: 1,
      rating: {
        total_rating: 1,
        total_star: 1,
      },
      sum_rating: 1,
      tagline: '',
    };
    data = [
      {
        quantity: 1,
        product: productMock,
      },
    ];

    localStorage.setItem('flye-cart', JSON.stringify(data));
  });

  afterEach(() => {
    localStorage.removeItem('flye-ecart');
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be cart items stored in local storage', () => {
    expect(localStorage.getItem('flye-cart')).toBeTruthy();
  });
  it('should retrieve store cart items', async () => {
    expect((await firstValueFrom(service.items$)).length > 0).toBeTruthy();
  });
  it('should be able to add a new cart item', async () => {
    service.addItem(productMock, 2);

    const items = await firstValueFrom(service.items$);

    expect(items).toContain({ quantity: 2, product: productMock });
  });
  it('should be able to remove existing cart item', async () => {
    service.removeItem({ product: productMock, quantity: 2 });

    service.items$.subscribe((items) => {
      // console.log(items);
      expect(items.length === 1).toBeTruthy();
    });
  });
});
