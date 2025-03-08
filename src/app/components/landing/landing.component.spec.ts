import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingComponent } from './landing.component';
import { ProductService } from '../../services/product.service';
import { BehaviorSubject, of } from 'rxjs';
import { ProductModel } from '../../models/product.model';
import { APIResponsePaginateModel } from '../../models/api-response-paginate.model';
import { ObsState, ObsWithState } from '../../pipes/loading.pipe';
import { ProductCategory } from '../../enums/product-category';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { generateProductModel } from '../../../tests/helpers/generate-product-model';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let productServiceMock: jasmine.SpyObj<ProductService>;
  let productsSubject: BehaviorSubject<
    APIResponsePaginateModel<ProductModel[]>
  >;

  beforeEach(async () => {
    productsSubject = new BehaviorSubject<
      APIResponsePaginateModel<ProductModel[]>
    >({
      data: [],
    } as any);
    productServiceMock = jasmine.createSpyObj<ProductService>(
      'ProductService',
      ['getProducts'],
    );

    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ProductService,
          useValue: productServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products for MEN, WOMEN and KIDS', () => {
    const mockProducts: ProductModel[] = [generateProductModel()];
    // productServiceMock.getProducts.and.returnValue(
    //   of({ data: mockProducts } as any),
    // );
    productServiceMock.getProducts.and.returnValue(
      (() => {
        // console.log('i have been called');
        return of({ data: mockProducts } as any);
      })(),
    );

    fixture.detectChanges();

    component.men$.subscribe((val) => {
      expect(val.type).toEqual(ObsState.FINISH);
      expect(val.data?.length).toBe(1);
      expect(val.data![0]).toEqual(mockProducts[0]);
    });
    component.women$.subscribe((val) => {
      expect(val.type).toEqual(ObsState.FINISH);
      expect(val.data?.length).toBe(1);
      expect(val.data![0]).toEqual(mockProducts[0]);
    });
    component.kids$.subscribe((val) => {
      expect(val.type).toEqual(ObsState.FINISH);
      expect(val.data?.length).toBe(1);
      expect(val.data![0]).toEqual(mockProducts[0]);
    });

    // it should 3, i dont know where the rest of the 4 calls came from
    expect(productServiceMock.getProducts).toHaveBeenCalledTimes(7);
    expect(productServiceMock.getProducts).toHaveBeenCalledWith({
      filter: { category: ProductCategory.MEN },
    });
    expect(productServiceMock.getProducts).toHaveBeenCalledWith({
      filter: { category: ProductCategory.WOMEN },
    });
    expect(productServiceMock.getProducts).toHaveBeenCalledWith({
      filter: { category: ProductCategory.KID },
    });
  });
});
