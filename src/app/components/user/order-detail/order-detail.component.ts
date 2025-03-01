import { Component, Input } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { OrderModel } from '../../../models/order.model';
import { OrderService } from '../../../services/order.service';
import { OrderBadgeComponent } from '../../core/order-badge/order-badge.component';
import { OrderStatus } from '../../../enums/order-status';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  imports: [OrderBadgeComponent, AsyncPipe],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css',
})
export class OrderDetailComponent {
  constructor(
    private orderService: OrderService,
    private router: Router,
  ) {}

  private orderSubject!: BehaviorSubject<OrderModel>;
  order$!: Observable<OrderModel>;

  @Input()
  set orderId(orderId: number) {
    this.orderService.getOrder(orderId).subscribe((value) => {
      this.orderSubject = new BehaviorSubject(value);
      this.order$ = this.orderSubject.asObservable();
    });
  }

  cancelOrder(orderId: number) {
    console.log(orderId);
    this.orderService
      .updateOrder(orderId, {
        status: OrderStatus.CANCELLED,
      })
      .pipe(switchMap(() => this.orderService.getOrder(orderId)))
      .subscribe((value) => {
        this.orderSubject.next(value);
      });
  }

  completeOrder(orderId: number) {
    this.orderService
      .updateOrder(orderId, {
        status: OrderStatus.COMPLETED,
      })
      .pipe(switchMap(() => this.orderService.getOrder(orderId)))
      .subscribe((value) => {
        this.orderSubject.next(value);
      });
  }

  reviewOrder(orderId: number) {
    this.router.navigate(['/profile/review', orderId]);
  }
}
