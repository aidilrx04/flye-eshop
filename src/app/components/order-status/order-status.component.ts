import { AsyncPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { LoadingComponent } from '../core/loading/loading.component';
import { SectionComponent } from '../core/section/section.component';
import { OrderService } from '../../services/order.service';
import { isNumberOr } from '../../utils/is-number-or';

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
        // debugger;
        if (orderId !== null && statusId !== null) {
          // TODO(aidil): disable this call on production mode
          this.updateOrderStatus(Number(statusId), Number(orderId));
        }
      }),
      map((params) => isNumberOr(params.get('status_id') ?? '0', 0) === 1),
    );

    this.isSuccess$.subscribe((value) => {
      console.log(value);
    });
  }
  updateOrderStatus(statusId: number, orderId: number) {
    this.orderService
      .updatePaymentStatus(statusId, orderId)
      .subscribe((value) => {
        console.log(value);
      });
  }
}
