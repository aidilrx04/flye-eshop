import { Routes } from '@angular/router';
import { ensureAuthenticatedGuard } from './guards/ensure-authenticated.guard';
import { checkAuthenticationGuard } from './guards/check-authentication.guard';
import { ensureUserIsAdminGuard } from './guards/ensure-user-is-admin.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [checkAuthenticationGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './components/core/layouts/main-layout/main-layout.component'
          ).then((m) => m.MainLayoutComponent),
        children: [
          {
            path: 'order/status',
            loadComponent: () =>
              import('./components/order-status/order-status.component').then(
                (m) => m.OrderStatusComponent,
              ),
          },
          {
            path: 'order/success',
            loadComponent: () =>
              import(
                './components/order-successful/order-successful.component'
              ).then((m) => m.OrderSuccessfulComponent),
          },
          {
            path: 'cart',
            loadComponent: () =>
              import('./components/cart/cart.component').then(
                (m) => m.CartComponent,
              ),
          },
          {
            path: 'signin',
            loadComponent: () =>
              import('./components/signin/signin.component').then(
                (m) => m.SigninComponent,
              ),
          },
          {
            path: 'signup',
            loadComponent: () =>
              import('./components/signup/signup.component').then(
                (m) => m.SignupComponent,
              ),
          },
          {
            path: 'signout',
            loadComponent: () =>
              import('./components/signout/signout.component').then(
                (m) => m.SignoutComponent,
              ),
          },
          {
            path: 'products',
            loadComponent: () =>
              import('./components/products/products.component').then(
                (m) => m.ProductsComponent,
              ),
          },
          {
            path: 'products/:productId',
            loadComponent: () =>
              import(
                './components/single-product/single-product.component'
              ).then((m) => m.SingleProductComponent),
          },
          {
            path: '',
            loadComponent: () =>
              import('./components/landing/landing.component').then(
                (m) => m.LandingComponent,
              ),
          },
        ],
      },
      {
        path: 'admin',
        loadComponent: () =>
          import(
            './components/core/layouts/admin-layout/admin-layout.component'
          ).then((m) => m.AdminLayoutComponent),
        canActivate: [ensureAuthenticatedGuard, ensureUserIsAdminGuard],
        children: [
          {
            path: 'orders',
            loadComponent: () =>
              import('./components/admin/orders/orders.component').then(
                (m) => m.OrdersComponent,
              ),
          },
          {
            path: 'orders/:orderId',
            loadComponent: () =>
              import(
                './components/admin/order-detail/order-detail.component'
              ).then((m) => m.OrderDetailComponent),
          },
          {
            path: 'products/create',
            loadComponent: () =>
              import(
                './components/admin/create-product/create-product.component'
              ).then((m) => m.CreateProductComponent),
          },
          {
            path: 'products',
            loadComponent: () =>
              import('./components/admin/products/products.component').then(
                (m) => m.ProductsComponent,
              ),
          },
          {
            path: 'products/:productId/edit',
            loadComponent: () =>
              import(
                './components/admin/edit-product/edit-product.component'
              ).then((m) => m.EditProductComponent),
          },
          {
            path: 'users',
            loadComponent: () =>
              import('./components/admin/users/users.component').then(
                (m) => m.UsersComponent,
              ),
          },
          {
            path: '',
            loadComponent: () =>
              import('./components/admin/dashboard/dashboard.component').then(
                (m) => m.DashboardComponent,
              ),
          },
        ],
      },
      {
        path: 'profile',
        loadComponent: () =>
          import(
            './components/core/layouts/user-layout/user-layout.component'
          ).then((m) => m.UserLayoutComponent),
        canActivate: [ensureAuthenticatedGuard],
        children: [
          {
            path: 'setting',
            loadComponent: () =>
              import('./components/user/setting/setting.component').then(
                (m) => m.SettingComponent,
              ),
          },
          {
            path: 'orders',
            loadComponent: () =>
              import('./components/user/orders/orders.component').then(
                (m) => m.OrdersComponent,
              ),
          },
          {
            path: 'orders/:orderId',
            loadComponent: () =>
              import(
                './components/user/order-detail/order-detail.component'
              ).then((m) => m.OrderDetailComponent),
          },
          {
            path: '',
            loadComponent: () =>
              import('./components/user/dashboard/dashboard.component').then(
                (m) => m.DashboardComponent,
              ),
          },
        ],
      },
    ],
  },
];
