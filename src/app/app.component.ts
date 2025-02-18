import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { SingleProductComponent } from './components/single-product/single-product.component';

@Component({
  selector: 'app-root',
  imports: [LandingComponent, SingleProductComponent],
  template: `<app-single-product />`,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'balls';
}
