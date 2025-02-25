import { Component } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Observable } from 'rxjs';
import { OrderModel } from '../../../models/order.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { OrderWithUserModel } from '../../../models/order-with-user.model';

@Component({
  selector: 'app-orders',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  constructor(private orderService: OrderService) {}

  orders$!: Observable<OrderWithUserModel[]>;

  ngOnInit() {
    this.orders$ = this.orderService.getOrderWithUsers();
    this.orders$.subscribe((val) => {
      console.log(val);
    });
  }
}
