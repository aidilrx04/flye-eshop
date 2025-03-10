import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBadgeComponent } from './order-badge.component';
import { ComponentRef } from '@angular/core';
import { OrderStatus } from '../../../enums/order-status';

describe('OrderBadgeComponent', () => {
  let component: OrderBadgeComponent;
  let fixture: ComponentFixture<OrderBadgeComponent>;
  let componentRef: ComponentRef<OrderBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderBadgeComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should computed to correct data with given status', () => {
    componentRef.setInput('status', OrderStatus.PENDING);
    fixture.detectChanges();
    expect(component.data()).toEqual(component.STATUS_DATA.PENDING);
    componentRef.setInput('status', OrderStatus.PREPARING);
    fixture.detectChanges();
    expect(component.data()).toEqual(component.STATUS_DATA.PREPARING);
    componentRef.setInput('status', OrderStatus.DELIVERING);
    fixture.detectChanges();
    expect(component.data()).toEqual(component.STATUS_DATA.DELIVERING);
    componentRef.setInput('status', OrderStatus.DELIVERED);
    fixture.detectChanges();
    expect(component.data()).toEqual(component.STATUS_DATA.DELIVERED);
    componentRef.setInput('status', OrderStatus.COMPLETED);
    fixture.detectChanges();
    expect(component.data()).toEqual(component.STATUS_DATA.COMPLETED);
    componentRef.setInput('status', OrderStatus.CANCELLED);
    fixture.detectChanges();
    expect(component.data()).toEqual(component.STATUS_DATA.CANCELLED);
  });
});
