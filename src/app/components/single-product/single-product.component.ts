import { Component } from '@angular/core';
import { NavbarComponent } from "../core/navbar/navbar.component";
import { SectionComponent } from "../core/section/section.component";
import { FooterComponent } from "../core/footer/footer.component";

@Component({
  selector: 'app-single-product',
  imports: [NavbarComponent, SectionComponent, FooterComponent],
  templateUrl: './single-product.component.html',
  styleUrl: './single-product.component.css'
})
export class SingleProductComponent {

}
