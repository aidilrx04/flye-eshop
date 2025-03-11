import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsComponent } from './products.component';
import { ProductService } from '../../../services/product.service';
import { MetaService } from '../../../services/meta.service';
import { ActivatedRoute } from '@angular/router';
import { map, of, throwError } from 'rxjs';
import { ProductModel } from '../../../models/product.model';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let metaServiceSpy: jasmine.SpyObj<MetaService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getProducts',
      'deleteProduct',
    ]);
    metaServiceSpy = jasmine.createSpyObj('MetaService', ['setMeta']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      queryParamMap: of(new Map<string, string>([['page', '1']])),
    });

    TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: MetaService, useValue: metaServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products on init', () => {
    const mockProducts: ProductModel[] = [
      { id: 1, name: 'Test Product' },
    ] as any;
    productServiceSpy.getProducts.and.returnValue(
      of({ data: mockProducts, meta: {} } as any),
    );

    component.ngOnInit();

    expect(productServiceSpy.getProducts).toHaveBeenCalled();
    component.products$.subscribe((products) => {
      expect(products).toEqual(mockProducts);
    });
  });

  it('should delete a product', () => {
    const productId = 1;
    productServiceSpy.deleteProduct.and.returnValue(of(null as any));
    productServiceSpy.getProducts.and.returnValue(
      of({ data: [], meta: {} } as any).pipe(map((value) => value.data)),
    );
    spyOn(window, 'alert');

    component.deleteProduct(productId);

    expect(productServiceSpy.deleteProduct).toHaveBeenCalledWith(productId);
    expect(window.alert).toHaveBeenCalledWith('product deleted');
  });

  it('should handle delete product failure', () => {
    const productId = 1;
    productServiceSpy.getProducts.and.returnValue(of({ data: [] } as any));
    productServiceSpy.deleteProduct.and.returnValue(
      throwError(() => ({ error: 'Delete failed' }) as any),
    );
    spyOn(window, 'alert');

    component.deleteProduct(productId);

    expect(productServiceSpy.deleteProduct).toHaveBeenCalledWith(productId);
    expect(window.alert).toHaveBeenCalledWith(
      'Failed to delete product[object Object]',
    );
  });
});
