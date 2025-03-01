import { Component, Input, signal } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { OrderModel } from '../../../models/order.model';
import { OrderWithUserModel } from '../../../models/order-with-user.model';
import { OrderService } from '../../../services/order.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { OrderBadgeComponent } from '../../core/order-badge/order-badge.component';
import { OrderStatus } from '../../../enums/order-status';

export interface UpdateOrderStatusData {
  status: OrderStatus;
  label: string;
  icon: string;
  color: string;
  description: string;
}

@Component({
  selector: 'app-order-detail',
  imports: [AsyncPipe, OrderBadgeComponent, CommonModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css',
})
export class OrderDetailComponent {
  constructor(private orderService: OrderService) {}

  order$!: Observable<OrderWithUserModel>;

  updateData: UpdateOrderStatusData[] = [
    {
      status: OrderStatus.PENDING,
      label: 'Pending',
      description: 'Waiting for payment to be made',
      icon: 'ph ph-hourglass',
      color: 'text-gray-800',
    },
    {
      status: OrderStatus.PREPARING,
      label: 'Preparing',
      description: 'Packaging and waiting to be delivered',
      icon: 'ph ph-package',
      color: 'text-yellow-500',
    },
    {
      status: OrderStatus.DELIVERING,
      label: 'Delivering / Shipping',
      description: 'Order is now being shipped to shipping address',
      icon: 'ph ph-rocket-launch',
      color: 'text-green-700',
    },
    {
      status: OrderStatus.DELIVERED,
      label: 'Delivered',
      description: 'Order is successfully sent to customer address',
      icon: 'ph ph-house-line',
      color: 'text-purple-700',
    },
    {
      status: OrderStatus.COMPLETED,
      label: 'Completed',
      description: 'Order is completed and received by customer',
      icon: 'ph ph-check-fat',
      color: 'text-blue-500',
    },
    {
      status: OrderStatus.CANCELLED,
      label: 'Cancelled',
      description: 'Order has been cancelled',
      icon: 'ph ph-x',
      color: 'text-red-500',
    },
  ];

  isModalOpen = signal(false);
  currentCheckedStatus = signal<OrderStatus>(OrderStatus.PENDING);

  @Input()
  set orderId(orderId: number) {
    this.order$ = this.orderService.getOrderWithUser(orderId);

    this.order$.subscribe((order) => {
      this.currentCheckedStatus.set(order.status);
    });
  }

  ngOnInit() {
    this.order$.subscribe((value) => {
      console.log(value);
    });
  }

  toggleModal() {
    this.isModalOpen.update((state) => !state);
  }
  setCurrentCheckedStatus(status: OrderStatus) {
    this.currentCheckedStatus.update(() => status);
  }

  async updateOrderStatus() {
    const status = this.currentCheckedStatus();
    const order = await firstValueFrom(this.order$);

    this.orderService
      .updateOrder(order.id, {
        status: status,
      })
      .subscribe((v) => {
        console.log(v);
        console.log('order updated');
        window.location.reload();
      });
  }
}
