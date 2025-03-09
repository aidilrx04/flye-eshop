import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselComponent } from './carousel.component';

describe('CarouselComponent', () => {
  let component: CarouselComponent;
  let fixture: ComponentFixture<CarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should compute total pages correctly', () => {
    fixture.componentRef.setInput('values', [1, 2, 3, 4, 5, 6]);
    component.itemPerPage.set(3); // 3 items per page
    expect(component.totalPage()).toBe(2);
  });

  it('should display correct items per page', () => {
    fixture.componentRef.setInput('values', [1, 2, 3, 4, 5, 6]);
    component.itemPerPage.set(3);
    component.page.set(0);

    expect(component.pageData()).toEqual([1, 2, 3]);

    component.page.set(1);
    expect(component.pageData()).toEqual([4, 5, 6]);
  });

  it('should navigate to the next page correctly', () => {
    fixture.componentRef.setInput('values', [1, 2, 3, 4, 5, 6]);
    component.itemPerPage.set(3);
    component.page.set(0);

    component.nextPage();
    expect(component.page()).toBe(1);

    component.nextPage(); // Should wrap around
    expect(component.page()).toBe(0);
  });

  it('should navigate to the previous page correctly', () => {
    fixture.componentRef.setInput('values', [1, 2, 3, 4, 5, 6]);
    component.itemPerPage.set(3);
    component.page.set(1);

    component.prevPage();
    expect(component.page()).toBe(0);

    component.prevPage(); // Should wrap around
    expect(component.page()).toBe(1);
  });

  it('should set the page correctly when setPage() is called', () => {
    fixture.componentRef.setInput('values', [1, 2, 3, 4, 5, 6]);
    component.itemPerPage.set(3);

    component.setPage(1);
    expect(component.page()).toBe(1);

    component.setPage(0);
    expect(component.page()).toBe(0);

    // component.setPage(99); // Out of range
    // expect(component.page()).toBe(0);
  });

  it('should update items per page on window resize', () => {
    spyOnProperty(window, 'innerWidth', 'get').and.returnValue(650);
    spyOnProperty(window.screen, 'width', 'get').and.returnValue(650);
    window.dispatchEvent(new Event('resize'));

    expect(component.itemPerPage()).toBe(2); // Should match pageConstraints
  });
});
