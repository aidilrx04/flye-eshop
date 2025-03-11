import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLayoutComponent } from './user-layout.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('UserLayoutComponent', () => {
  let component: UserLayoutComponent;
  let fixture: ComponentFixture<UserLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLayoutComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
