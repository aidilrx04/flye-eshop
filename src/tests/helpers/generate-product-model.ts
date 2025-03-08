import { ProductCategory } from '../../app/enums/product-category';
import { ProductModel } from '../../app/models/product.model';
import { faker } from '@faker-js/faker';

export function generateProductModel(): ProductModel {
  return {
    id: faker.number.int(),
    name: faker.commerce.productName(),
    category: faker.helpers.arrayElement([
      ProductCategory.MEN,
      ProductCategory.WOMEN,
      ProductCategory.KID,
    ]),
    description: faker.word.words(),
    tagline: faker.word.words(),
    created_at: new Date(0),
    updated_at: new Date(0),
    image_urls: [faker.image.urlLoremFlickr()],
    price: parseFloat(faker.commerce.price()),
    rating: {
      total_rating: 1,
      total_star: 1,
    },
    sum_rating: 1,
  };
}
