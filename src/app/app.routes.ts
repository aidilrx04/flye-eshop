import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { SingleProductComponent } from './components/single-product/single-product.component';
import { ProductsComponent } from './components/products/products.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { DashboardComponent as AdminDashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ProductsComponent as AdminProductsComponent } from './components/admin/products/products.component';
import { CreateProductComponent as AdminCreateProductComponent } from './components/admin/create-product/create-product.component';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderSuccessfulComponent } from './components/order-successful/order-successful.component';
import { OrdersComponent as AdminOrdersComponent } from './components/admin/orders/orders.component';
import { ensureAuthenticatedGuard } from './guards/ensure-authenticated.guard';
import { MainLayoutComponent } from './components/core/layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'order/success',
        component: OrderSuccessfulComponent,
      },
      {
        path: 'cart',
        component: CartComponent,
      },
      {
        path: 'signin',
        component: SigninComponent,
      },
      {
        path: 'signup',
        component: SignupComponent,
      },
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'products/:productId',
        component: SingleProductComponent,
      },
      {
        path: '',
        component: LandingComponent,
      },
    ],
  },
  // admin
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [ensureAuthenticatedGuard],
    children: [
      {
        path: 'orders',
        component: AdminOrdersComponent,
      },
      {
        path: 'products/create',
        component: AdminCreateProductComponent,
      },
      {
        path: 'products',
        component: AdminProductsComponent,
      },
      {
        path: '',
        component: AdminDashboardComponent,
      },
    ],
  },
  // admin
];
