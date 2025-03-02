import { Component } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { BehaviorSubject, switchMap } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { OrderWithUserModel } from '../../../models/order-with-user.model';
import { DropdownComponent } from '../../core/dropdown/dropdown.component';
import { DropdownItemComponent } from '../../core/dropdown-item/dropdown-item.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderBadgeComponent } from '../../core/order-badge/order-badge.component';
import { PagingComponent } from '../../core/paging/paging.component';
import { MetaService } from '../../../services/meta.service';
import { isNumberOr } from '../../../utils/is-number-or';

@Component({
  selector: 'app-orders',
  imports: [
    AsyncPipe,
    CommonModule,
    DropdownComponent,
    DropdownItemComponent,
    RouterLink,
    OrderBadgeComponent,
    PagingComponent,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private metaService: MetaService,
  ) {}

  private ordersSubject = new BehaviorSubject<OrderWithUserModel[]>([]);
  orders$ = this.ordersSubject.asObservable();

  ngOnInit() {
    this.route.queryParamMap
      .pipe(
        switchMap((params) =>
          this.orderService.getOrders<OrderWithUserModel>({
            includes: ['user'],
            page: isNumberOr(params.get('page'), 1),
          }),
        ),
      )
      .subscribe((value) => {
        this.ordersSubject.next(value.data);
        this.metaService.setMeta(value.meta);
        console.log(value);
      });
    this.orders$.subscribe((val) => {
      console.log(val);
    });
  }
}
