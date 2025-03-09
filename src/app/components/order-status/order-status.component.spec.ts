import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatusComponent } from './order-status.component';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { BehaviorSubject, filter, last, lastValueFrom, of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { OrderService } from '../../services/order.service';

describe('OrderStatusComponent', () => {
  let component: OrderStatusComponent;
  let fixture: ComponentFixture<OrderStatusComponent>;
  let routeMock: jasmine.SpyObj<ActivatedRoute>;
  let queryParamMapMock: BehaviorSubject<ParamMap>;
  let orderServiceMock: jasmine.SpyObj<OrderService>;

  beforeEach(async () => {
    queryParamMapMock = new BehaviorSubject<ParamMap>(convertToParamMap({}));
    routeMock = jasmine.createSpyObj<ActivatedRoute>('ActivatedRoute', [], {
      queryParamMap: queryParamMapMock.asObservable(),
    });

    orderServiceMock = jasmine.createSpyObj<OrderService>('OrderService', [
      'updatePaymentStatus',
    ]);

    await TestBed.configureTestingModule({
      imports: [OrderStatusComponent],
      providers: [
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: routeMock,
        },
        {
          provide: OrderService,
          useValue: orderServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderStatusComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be failed if status_id or order_id is missing', (done) => {
    fixture.detectChanges();

    component.isSuccess$.subscribe((val) => {
      expect(val).toBeFalsy();
      done();
    });
  });
  it('should be successful and update order payment status', (done) => {
    queryParamMapMock.next(
      convertToParamMap({
        status_id: 1,
        order_id: 1,
      }),
    );
    orderServiceMock.updatePaymentStatus.and.returnValue(of(true));

    fixture.detectChanges();

    component.isSuccess$.subscribe((success) => {
      expect(success).toBeTruthy();
      expect(orderServiceMock.updatePaymentStatus).toHaveBeenCalled();
      expect(orderServiceMock.updatePaymentStatus).toHaveBeenCalledWith(1, 1);
      done();
    });
  });
});
