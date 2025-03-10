import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersComponent } from './orders.component';
import { OrderService } from '../../../services/order.service';
import { MetaService } from '../../../services/meta.service';
import { ActivatedRoute, Params } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { OrderStatus } from '../../../enums/order-status';

describe('AdminOrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  let mockOrderService: jasmine.SpyObj<OrderService>;
  let mockMetaService: jasmine.SpyObj<MetaService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    mockOrderService = jasmine.createSpyObj('OrderService', ['getOrders']);
    mockMetaService = jasmine.createSpyObj('MetaService', ['setMeta'], {
      meta$: of({ links: [] }),
    });

    mockActivatedRoute = jasmine.createSpyObj<ActivatedRoute>(
      'ActivatedRoute',
      [],
      {
        queryParamMap: of({
          get: (key: string) => (key === 'page' ? '1' : null),
        } as any),
        queryParams: of({}),
      },
    );

    await TestBed.configureTestingModule({
      imports: [OrdersComponent],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        { provide: MetaService, useValue: mockMetaService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;

    const mockOrders = {
      data: [
        {
          id: 1,
          user: { id: 101, full_name: 'John Doe' },
          items: [{ product: { image_urls: [] } }],
          status: OrderStatus.PENDING,
        },
        {
          id: 2,
          user: { id: 102, full_name: 'Jane Doe' },
          items: [{ product: { image_urls: [] } }],
          status: OrderStatus.PENDING,
        },
      ],
      meta: { total: 2, page: 1 },
    };

    mockOrderService.getOrders.and.returnValue(of(mockOrders) as any);

    // fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch orders when initialized', (done) => {
    fixture.detectChanges();
    component.orders$.subscribe((orders) => {
      expect(orders.length).toBe(2);
      expect(orders[0].user.full_name).toBe('John Doe');
      expect(orders[1].user.full_name).toBe('Jane Doe');
      done();
    });
  });

  it('should update ordersSubject when new orders are fetched', async () => {
    const mockNewOrders = {
      data: [
        {
          id: 3,
          user: { id: 103, full_name: 'Alice' },
          items: [{ product: { image_urls: [] } }],
          status: OrderStatus.PENDING,
        },
      ],
      meta: { total: 1, page: 2 },
    };

    mockOrderService.getOrders.and.returnValue(of(mockNewOrders) as any);
    fixture.detectChanges();

    const orders = await firstValueFrom(component.orders$);
    expect(orders.length).toBe(1);
    expect(orders[0].user.full_name).toBe('Alice');
  });

  it('should set meta data using metaService', () => {
    fixture.detectChanges();
    expect(mockMetaService.setMeta).toHaveBeenCalledWith({
      total: 2,
      page: 1,
    } as any);
  });
});
