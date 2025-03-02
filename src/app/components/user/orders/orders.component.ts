import { Component } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { OrderModel } from '../../../models/order.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { DropdownComponent } from '../../core/dropdown/dropdown.component';
import { DropdownItemComponent } from '../../core/dropdown-item/dropdown-item.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { OrderBadgeComponent } from '../../core/order-badge/order-badge.component';
import { MetaService } from '../../../services/meta.service';
import { PagingComponent } from "../../core/paging/paging.component";

@Component({
  selector: 'app-orders',
  imports: [
    AsyncPipe,
    DropdownComponent,
    DropdownItemComponent,
    RouterLink,
    CommonModule,
    OrderBadgeComponent,
    PagingComponent
],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  constructor(
    private orderService: OrderService,
    private metaService: MetaService,
  ) {}

  private orderSubject = new BehaviorSubject<OrderModel[]>([]);
  orders$ = this.orderSubject.asObservable();

  ngOnInit() {
    this.metaService.query$
      .pipe(switchMap((query) => this.orderService.getOrders(query)))
      .subscribe((res) => {
        this.orderSubject.next(res.data);
        this.metaService.setMeta(res.meta);
      });
  }
}
