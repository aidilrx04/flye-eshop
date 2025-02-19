import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { SingleProductComponent } from './components/single-product/single-product.component';
import { ProductsComponent } from './components/products/products.component';
import { SignupComponent } from './components/signup/signup.component';

export const routes: Routes = [
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'single-product',
    component: SingleProductComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: '',
    component: LandingComponent,
  },
];
