import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBadgeComponent } from './order-badge.component';

describe('OrderBadgeComponent', () => {
  let component: OrderBadgeComponent;
  let fixture: ComponentFixture<OrderBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
