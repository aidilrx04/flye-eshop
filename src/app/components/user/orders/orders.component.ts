import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderModel } from '../../../models/order.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { DropdownComponent } from '../../core/dropdown/dropdown.component';
import { DropdownItemComponent } from '../../core/dropdown-item/dropdown-item.component';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { AdminLayoutComponent } from "../../core/layouts/admin-layout/admin-layout.component";
import { OrderStatusComponent } from "../../order-status/order-status.component";
import { OrderBadgeComponent } from "../../core/order-badge/order-badge.component";

@Component({
  selector: 'app-orders',
  imports: [
    AsyncPipe,
    DropdownComponent,
    DropdownItemComponent,
    RouterLink,
    CommonModule,
    OrderBadgeComponent
],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  constructor(private orderService: OrderService) {}

  orders$!: Observable<OrderModel[]>;

  ngOnInit() {
    this.orders$ = this.orderService.getOrders();
  }
}
