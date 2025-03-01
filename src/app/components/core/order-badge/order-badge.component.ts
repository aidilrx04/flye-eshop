import { Component, computed, input } from '@angular/core';
import { OrderStatus } from '../../../enums/order-status';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-badge',
  imports: [CommonModule],
  templateUrl: './order-badge.component.html',
  styleUrl: './order-badge.component.css',
})
export class OrderBadgeComponent {
  status = input.required<OrderStatus>();

  STATUS_DATA = {
    [OrderStatus.PENDING]: {
      background: 'bg-gray-700',
      color: 'text-white',
      icon: 'ph ph-hourglass',
    },
    [OrderStatus.PREPARING]: {
      background: 'bg-yellow-500',
      color: 'text-gray-900',
      icon: 'ph ph-package',
    },
    [OrderStatus.DELIVERING]: {
      background: 'bg-green-700',
      color: 'text-white',
      icon: 'ph ph-rocket-launch',
    },
    [OrderStatus.DELIVERED]: {
      background: 'bg-purple-500',
      color: 'text-white',
      icon: 'ph ph-house-line',
    },
    [OrderStatus.COMPLETED]: {
      background: 'bg-blue-500',
      color: 'text-white',
      icon: 'ph ph-check-fat',
    },
  };

  data = computed(() => this.STATUS_DATA[this.status()]);
}
