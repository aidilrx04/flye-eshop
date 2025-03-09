import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavItemComponent } from './nav-item.component';
import { NavItemType } from './nav-item-type';
import { provideRouter } from '@angular/router';

describe('NavItemComponent', () => {
  let component: NavItemComponent;
  let fixture: ComponentFixture<NavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavItemComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NavItemComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be false if item is not a header', () => {
    fixture.componentRef.setInput('item', {
      type: NavItemType.LINK,
    });
    fixture.detectChanges();

    expect(component.isHeader).toBeFalsy();
  });
  it('should be treu if item is a header', () => {
    fixture.componentRef.setInput('item', {
      type: NavItemType.HEADER,
    });
    fixture.detectChanges();

    expect(component.isHeader).toBeTruthy();
  });
});
