import { AsyncPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { LoadingComponent } from '../core/loading/loading.component';
import { SectionComponent } from '../core/section/section.component';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-status',
  imports: [AsyncPipe, SectionComponent],
  templateUrl: './order-status.component.html',
  styleUrl: './order-status.component.css',
})
export class OrderStatusComponent {
  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
  ) {}

  isSuccess$!: Observable<boolean>;

  ngOnInit() {
    this.isSuccess$ = this.route.queryParamMap.pipe(
      tap((params) => {
        const orderId = params.get('order_id');
        const statusId = params.get('status_id');

        if (orderId !== null && statusId !== null) {
          this.updateOrderStatus(Number(statusId), Number(orderId));
        }
      }),
      map((params) => (params.get('status_id') ?? '0') === '1'),
    );

    this.isSuccess$.subscribe((value) => {
      console.log(value);
    });
  }
  updateOrderStatus(statusId: number, orderId: number) {
    this.orderService
      .updateOrderStatus(statusId, orderId)
      .subscribe((value) => {
        console.log(value);
      });
  }
}
