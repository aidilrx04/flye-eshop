import { Component } from '@angular/core';
import { CarouselComponent } from '../core/carousel/carousel.component';
import { faker } from '@faker-js/faker';
import { Product } from '../../classes/product/product';
import { SectionComponent } from '../core/section/section.component';
import { FooterComponent } from '../core/footer/footer.component';
import { NavbarComponent } from '../core/navbar/navbar.component';
import { ProductCardComponent } from '../core/product-card/product-card.component';
import { ProductModel } from '../../models/product.model';

@Component({
  selector: 'app-landing',
  imports: [
    CarouselComponent,
    SectionComponent,
    FooterComponent,
    NavbarComponent,
    ProductCardComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  menData = this.generateCarouselData();
  womenData = this.generateCarouselData();
  kidsData = this.generateCarouselData();

  footerData = {
    address: `${faker.location.streetAddress({ useFullAddress: true })}, ${faker.location.city()}, ${faker.location.country()}`,
  };

  ngOnInit() {
    // console.log(this.firstCarousel);
  }

  generateCarouselData() {
    const amount = 10;

    const result: ProductModel[] = [];
    for (let i = 0; i < amount; i++) {
      const title = `${faker.commerce.productAdjective()} ${faker.commerce.product()}`;
      const price = Number(faker.commerce.price());
      const rating = faker.number.float({ min: 1, max: 2, fractionDigits: 1 });
      const imageUrl = faker.image.urlLoremFlickr();

      result.push({
        image_urls: [imageUrl],
        name: title,
        rating,
        price,
        created_at: new Date(),
        updated_at: new Date(),
        description: '',
        tagline: '',
        id: -1,
      });
    }

    return result;
  }
}
