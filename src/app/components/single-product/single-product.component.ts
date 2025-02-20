import { Component, Input } from '@angular/core';
import { NavbarComponent } from '../core/navbar/navbar.component';
import { SectionComponent } from '../core/section/section.component';
import { FooterComponent } from '../core/footer/footer.component';
import { HeroComponent } from '../core/hero/hero.component';
import { Observable } from 'rxjs';
import { ProductModel } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-single-product',
  imports: [SectionComponent, HeroComponent, AsyncPipe],
  templateUrl: './single-product.component.html',
  styleUrl: './single-product.component.css',
})
export class SingleProductComponent {
  constructor(private productService: ProductService) {}

  product$!: Observable<ProductModel>;

  @Input()
  set productId(productId: number) {
    this.product$ = this.productService.getProduct(productId);
  }

  ngOnInit() {
    this.product$.subscribe((value) => {
      console.log(value);
    });
  }
}
