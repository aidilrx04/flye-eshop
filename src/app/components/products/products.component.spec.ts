import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { ProductsComponent } from './products.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  ActivatedRoute,
  convertToParamMap,
  ParamMap,
  provideRouter,
} from '@angular/router';
import { ProductService } from '../../services/product.service';
import { BehaviorSubject, filter, of } from 'rxjs';
import { generateProductModel } from '../../../tests/helpers/generate-product-model';
import { APIResponsePaginateModel } from '../../models/api-response-paginate.model';
import { ProductModel } from '../../models/product.model';
import { ObsState } from '../../pipes/loading.pipe';
import { ProductCategory } from '../../enums/product-category';

describe('MainProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productServiceMock: jasmine.SpyObj<ProductService>;
  let routeMock: jasmine.SpyObj<ActivatedRoute>;
  let queryParamMock: BehaviorSubject<ParamMap>;

  beforeEach(async () => {
    productServiceMock = jasmine.createSpyObj<ProductService>(
      'ProductService',
      ['getProducts'],
    );

    queryParamMock = new BehaviorSubject<ParamMap>(convertToParamMap({}));
    routeMock = jasmine.createSpyObj<ActivatedRoute>('ActivatedRoute', [], {
      queryParamMap: queryParamMock.asObservable(),
    });

    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ProductService,
          useValue: productServiceMock,
        },
        {
          provide: ActivatedRoute,
          useValue: routeMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch list of products', () => {
    const productsMock = [generateProductModel()];

    productServiceMock.getProducts.and.returnValue(
      of({
        data: productsMock,
        links: [] as any,
        meta: {
          current_page: 1,
          from: 1,
          last_page: 1,
          links: [],
          path: '',
          per_page: 1,
          to: 1,
          total: 1,
        },
      } as APIResponsePaginateModel<ProductModel>),
    );

    fixture.detectChanges();

    component.products$
      .pipe(filter((res) => res.type !== ObsState.START))
      .subscribe((products) => {
        expect(products.type).toEqual(ObsState.FINISH);
        expect(products.data!).toBeInstanceOf(Array);
        expect(products.data?.length).toEqual(1);
        expect(products.data![0].name).toEqual(productsMock[0].name);
      });

    // expect(productServiceMock.getProducts).toHaveBeenCalledTimes(1);
  });
  it('should update page meta', () => {
    const productsMock = [generateProductModel()];

    productServiceMock.getProducts.and.returnValue(
      of({
        data: productsMock,
        links: [] as any,
        meta: {
          current_page: 1,
          from: 1,
          last_page: 1,
          links: [],
          path: '',
          per_page: 1,
          to: 1,
          total: 1,
        },
      } as APIResponsePaginateModel<ProductModel>),
    );

    fixture.detectChanges();

    component.pageMeta$.subscribe((meta) => {
      expect(meta.total).toEqual(1);
    });
    expect(productServiceMock.getProducts).toHaveBeenCalledTimes(1);
  });
  it('should update category label with query string', (done) => {
    expect(component.categoryLabel()).toEqual('Explore Our Products');

    queryParamMock.next(
      convertToParamMap({
        category: ProductCategory.MEN,
      }),
    );

    fixture.detectChanges();

    setTimeout(() => {
      expect(component.categoryLabel()).toEqual(
        ProductCategory.MEN.toLowerCase(),
      );
      done();
    });

    // queryParamMock.next(
    //   convertToParamMap({
    //     category: ProductCategory.KID,
    //   }),
    // );

    // expect(component.categoryLabel()).toEqual(
    //   ProductCategory.KID.toLowerCase(),
    // );
  });
});
