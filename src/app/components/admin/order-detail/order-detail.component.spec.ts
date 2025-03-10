import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailComponent } from './order-detail.component';
import { OrderService } from '../../../services/order.service';
import { ModalService } from '../../../services/modal.service';
import { OrderWithUserModel } from '../../../models/order-with-user.model';
import { OrderStatus } from '../../../enums/order-status';
import { firstValueFrom, of } from 'rxjs';

describe('OrderDetailComponent', () => {
  let component: OrderDetailComponent;
  let fixture: ComponentFixture<OrderDetailComponent>;
  let mockOrderService: jasmine.SpyObj<OrderService>;
  let mockModalService: jasmine.SpyObj<ModalService>;

  beforeEach(async () => {
    mockOrderService = jasmine.createSpyObj('OrderService', [
      'getOrderWithUser',
      'updateOrder',
      'getOrder',
    ]);
    mockModalService = jasmine.createSpyObj('ModalService', [
      'openModal',
      'closeCurrentModal',
    ]);

    await TestBed.configureTestingModule({
      imports: [OrderDetailComponent],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        { provide: ModalService, useValue: mockModalService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailComponent);
    component = fixture.componentInstance;

    const mockOrder: OrderWithUserModel = {
      id: 1,
      user: {
        id: 101,
        full_name: 'John Doe',
        email: 'john@example.com',
      } as any,
      status: OrderStatus.PENDING,
      created_at: new Date(),
      updated_at: new Date(),
    } as any;

    mockOrderService.getOrderWithUser.and.returnValue(of(mockOrder));
    mockOrderService.updateOrder.and.returnValue(of({ success: true } as any));
    mockOrderService.getOrder.and.returnValue(of(mockOrder));

    component.orderId = mockOrder.id;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct order details', async () => {
    const order = await firstValueFrom(component.order$);
    expect(order.id).toBe(1);
    expect(order.status).toBe(OrderStatus.PENDING);
  });

  it('should open the status modal', () => {
    component.openStatusModal();
    expect(mockModalService.openModal).toHaveBeenCalled();
  });

  it('should update the current checked status', () => {
    component.setCurrentCheckedStatus(OrderStatus.DELIVERED);
    expect(component.currentCheckedStatus()).toBe(OrderStatus.DELIVERED);
  });

  it('should call updateOrderStatus() and refresh order details', async () => {
    await component.updateOrderStatus();

    expect(mockOrderService.updateOrder).toHaveBeenCalledWith(1, {
      status: OrderStatus.PENDING,
    });
    expect(mockOrderService.getOrder).toHaveBeenCalledWith(1);
    expect(mockModalService.closeCurrentModal).toHaveBeenCalled();
  });
});
