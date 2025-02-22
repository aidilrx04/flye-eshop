import { Component } from '@angular/core';
import { SectionComponent } from '../core/section/section.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-successful',
  imports: [SectionComponent, RouterLink],
  templateUrl: './order-successful.component.html',
  styleUrl: './order-successful.component.css',
})
export class OrderSuccessfulComponent {}
