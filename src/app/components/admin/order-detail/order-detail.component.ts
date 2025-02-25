import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderModel } from '../../../models/order.model';
import { OrderWithUserModel } from '../../../models/order-with-user.model';
import { OrderService } from '../../../services/order.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  imports: [AsyncPipe],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css',
})
export class OrderDetailComponent {
  constructor(private orderService: OrderService) {}

  order$!: Observable<OrderWithUserModel>;

  @Input()
  set orderId(orderId: number) {
    this.order$ = this.orderService.getOrderWithUser(orderId);
  }

  ngOnInit() {
    this.order$.subscribe((value) => {
      console.log(value);
    });
  }
}
