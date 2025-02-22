import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardComponent } from './product-card.component';
import { provideRouter } from '@angular/router';
import { ProductModel } from '../../../models/product.model';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', {
      id: -1,
      created_at: new Date(),
      updated_at: new Date(),
      description: '',
      name: 'balls',
      image_urls: ['https://loreflickr.com/123/123'],
      price: 1,
      rating: 1,
      tagline: '',
    } as ProductModel);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have product name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(
      compiled.querySelector('span.text-2xl.font-bold')?.textContent,
    ).toEqual('balls');
  });
});
