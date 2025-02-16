import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';

@Component({
  selector: 'app-root',
  imports: [LandingComponent],
  template: `<app-landing />`,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'balls';
}
