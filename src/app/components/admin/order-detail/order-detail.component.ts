import {
  Component,
  Input,
  signal,
  TemplateRef,
  viewChild,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable, switchMap } from 'rxjs';
import { OrderWithUserModel } from '../../../models/order-with-user.model';
import { OrderService } from '../../../services/order.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { OrderBadgeComponent } from '../../core/order-badge/order-badge.component';
import { OrderStatus } from '../../../enums/order-status';
import { ModalService } from '../../../services/modal.service';
import { LoadingComponent } from '../../core/loading/loading.component';
import { currency } from '../../../utils/currency';

export interface UpdateOrderStatusData {
  status: OrderStatus;
  label: string;
  icon: string;
  color: string;
  description: string;
}

@Component({
  selector: 'app-order-detail',
  imports: [AsyncPipe, OrderBadgeComponent, CommonModule, LoadingComponent],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css',
})
export class OrderDetailComponent {
  constructor(
    private orderService: OrderService,
    private modalService: ModalService,
  ) {}

  fcurrency = currency;

  private orderSubject!: BehaviorSubject<OrderWithUserModel>;
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

  currentCheckedStatus = signal<OrderStatus>(OrderStatus.PENDING);
  statusTemplate = viewChild<TemplateRef<any>>('statusTemplate');

  @Input()
  set orderId(orderId: number) {
    this.orderService.getOrderWithUser(orderId).subscribe((value) => {
      this.orderSubject = new BehaviorSubject(value);
      this.order$ = this.orderSubject.asObservable();
      this.order$.subscribe((order) => {
        this.currentCheckedStatus.set(order.status);
      });
    });
  }

  openStatusModal() {
    this.modalService.openModal(this.statusTemplate()!);
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
      .pipe(switchMap(() => this.orderService.getOrder(order.id)))
      .subscribe((v) => {
        this.orderSubject.next({
          ...this.orderSubject.value,
          ...v,
        });

        this.modalService.closeCurrentModal();
      });
  }
}
