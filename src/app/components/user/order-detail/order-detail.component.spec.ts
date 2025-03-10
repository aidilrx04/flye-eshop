import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailComponent } from './order-detail.component';
import { OrderService } from '../../../services/order.service';
import { Router } from '@angular/router';
import { OrderModel } from '../../../models/order.model';
import { OrderStatus } from '../../../enums/order-status';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('OrderDetailComponent', () => {
  let component: OrderDetailComponent;
  let fixture: ComponentFixture<OrderDetailComponent>;
  let mockOrderService: jasmine.SpyObj<OrderService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockOrderService = jasmine.createSpyObj('OrderService', [
      'getOrder',
      'updateOrder',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [OrderDetailComponent],
      providers: [
        provideHttpClient(),
        { provide: OrderService, useValue: mockOrderService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set order$ when orderId is assigned', () => {
    const orderMock: OrderModel = {
      id: 1,
      status: OrderStatus.PENDING,
      total: 100,
    } as any;
    mockOrderService.getOrder.and.returnValue(of(orderMock));

    component.orderId = 1;
    fixture.detectChanges();

    component.order$.subscribe((order) => {
      expect(order).toEqual(orderMock);
    });
  });

  it('should cancel order and refresh order data', () => {
    const orderMock: OrderModel = {
      id: 1,
      status: OrderStatus.PENDING,
      total: 100,
    } as any;
    const updatedOrderMock: OrderModel = {
      id: 1,
      status: OrderStatus.CANCELLED,
      total: 100,
    } as any;

    mockOrderService.getOrder.and.returnValue(of(orderMock));
    component.orderId = 1;
    fixture.detectChanges();

    mockOrderService.updateOrder.and.returnValue(of(updatedOrderMock));
    mockOrderService.getOrder.and.returnValue(of(updatedOrderMock));

    component.cancelOrder(1);

    component.order$.subscribe((order) => {
      expect(order.status).toEqual(OrderStatus.CANCELLED);
    });

    expect(mockOrderService.updateOrder).toHaveBeenCalledWith(1, {
      status: OrderStatus.CANCELLED,
    });
  });

  it('should complete order and refresh order data', () => {
    const orderMock: OrderModel = {
      id: 1,
      status: OrderStatus.PENDING,
      total: 100,
    } as any;
    const updatedOrderMock: OrderModel = {
      id: 1,
      status: OrderStatus.COMPLETED,
      total: 100,
    } as any;

    mockOrderService.getOrder.and.returnValue(of(orderMock));
    component.orderId = 1;
    fixture.detectChanges();

    mockOrderService.updateOrder.and.returnValue(of(updatedOrderMock));
    mockOrderService.getOrder.and.returnValue(of(updatedOrderMock));

    component.completeOrder(1);

    component.order$.subscribe((order) => {
      expect(order.status).toEqual(OrderStatus.COMPLETED);
    });

    expect(mockOrderService.updateOrder).toHaveBeenCalledWith(1, {
      status: OrderStatus.COMPLETED,
    });
  });

  it('should navigate to review page when reviewOrder is called', () => {
    component.reviewOrder(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile/review', 1]);
  });
});
