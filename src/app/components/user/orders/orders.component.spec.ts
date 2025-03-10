import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersComponent } from './orders.component';
import { OrderService } from '../../../services/order.service';
import { MetaService } from '../../../services/meta.service';
import { BehaviorSubject, of } from 'rxjs';
import { OrderModel } from '../../../models/order.model';
import { OrderStatus } from '../../../enums/order-status';
import { provideRouter } from '@angular/router';

describe('UserOrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  let mockOrderService: jasmine.SpyObj<OrderService>;
  let mockMetaService: jasmine.SpyObj<MetaService>;
  let querySubject: BehaviorSubject<any>;

  beforeEach(async () => {
    mockOrderService = jasmine.createSpyObj('OrderService', ['getOrders']);
    mockMetaService = jasmine.createSpyObj('MetaService', ['setMeta'], {
      query$: new BehaviorSubject({}), // Simulated query observable
      meta$: of({
        links: [],
      }),
    });

    await TestBed.configureTestingModule({
      imports: [OrdersComponent],
      providers: [
        provideRouter([]),
        { provide: OrderService, useValue: mockOrderService },
        { provide: MetaService, useValue: mockMetaService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch orders when initialized and update orders$', () => {
    const ordersMock: OrderModel[] = [
      {
        id: 1,
        status: OrderStatus.PENDING,
        total: 100,
        items: [{ product: { image_urls: [''] } }],
      },
      {
        id: 2,
        status: OrderStatus.COMPLETED,
        total: 200,
        items: [{ product: { image_urls: [''] } }],
      },
    ] as any;
    const metaMock = { total: 2, page: 1 };

    mockOrderService.getOrders.and.returnValue(
      of({ data: ordersMock, meta: metaMock } as any),
    );

    // component.ngOnInit();
    fixture.detectChanges();

    component.orders$.subscribe((orders) => {
      expect(orders).toEqual(ordersMock);
    });

    expect(mockMetaService.setMeta).toHaveBeenCalledWith(metaMock as any);
  });
});
