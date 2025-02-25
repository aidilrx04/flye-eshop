import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { SingleProductComponent } from './components/single-product/single-product.component';
import { ProductsComponent } from './components/products/products.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { DashboardComponent as AdminDashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ProductsComponent as AdminProductsComponent } from './components/admin/products/products.component';
import { CreateProductComponent as AdminCreateProductComponent } from './components/admin/create-product/create-product.component';
import { AdminLayoutComponent } from './components/core/layouts/admin-layout/admin-layout.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderSuccessfulComponent } from './components/order-successful/order-successful.component';
import { OrdersComponent as AdminOrdersComponent } from './components/admin/orders/orders.component';
import { ensureAuthenticatedGuard } from './guards/ensure-authenticated.guard';
import { MainLayoutComponent } from './components/core/layouts/main-layout/main-layout.component';
import { checkAuthenticationGuard } from './guards/check-authentication.guard';
import { EditProductComponent as AdminEditProductComponent } from './components/admin/edit-product/edit-product.component';
import { OrderDetailComponent as AdminOrderDetailComponent } from './components/admin/order-detail/order-detail.component';
import { UserLayoutComponent } from './components/core/layouts/user-layout/user-layout.component';
import { DashboardComponent as UserDashboardComponent } from './components/user/dashboard/dashboard.component';
import { OrdersComponent as UserOrdersComponent } from './components/user/orders/orders.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [checkAuthenticationGuard],
    children: [
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
            path: 'orders/:orderId',
            component: AdminOrderDetailComponent,
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
            path: 'products/:productId/edit',
            component: AdminEditProductComponent,
          },
          {
            path: '',
            component: AdminDashboardComponent,
          },
        ],
      },
      {
        path: 'profile',
        component: UserLayoutComponent,
        canActivate: [ensureAuthenticatedGuard],
        children: [
          {
            path: 'orders',
            component: UserOrdersComponent,
          },
          {
            path: '',
            component: UserDashboardComponent,
          },
        ],
      },
    ],
  },
];
