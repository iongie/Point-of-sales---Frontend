import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';
import { AuthGuard } from './services/guard/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () => import('./views/login/login.module').then(m => m.LoginModule),
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard],
        data: {
          role: [1, 2]
        }
      },
      {
        path: 'cart',
        children: [
          {
            path: ':id',
            loadChildren: () => import('./views/cart/cart.module').then(m => m.CartModule),
            canActivate: [AuthGuard],
            data: {
              role: [1, 2]
            }
          }
        ]
      },
      
      {
        path: 'pay',
        children: [
          {
            path: ':id',
            loadChildren: () => import('./views/payment/payment.module').then(m => m.PaymentModule),
            canActivate: [AuthGuard],
            data: {
              role: [1, 2]
            }
          }
        ]
      },
      {
        path: 'privilege',
        loadChildren: () => import('./views/privileges/view-privilege/view-privilege.module').then(m => m.ViewPrivilegeModule),
        canActivate: [AuthGuard],
        data: {
          role: [1, 2]
        }
      },
      {
        path: 'user',
        loadChildren: () => import('./views/users/view-user/view-user.module').then(m => m.ViewUserModule),
        canActivate: [AuthGuard],
        data: {
          role: [1, 2]
        }
      },
      {
        path: 'dining-table',
        loadChildren: () => import('./views/dining-tables/view-dining-table/view-dining-table.module').then(m => m.ViewDiningTableModule),
        canActivate: [AuthGuard],
        data: {
          role: [1, 2]
        }
      },
      {
        path: 'kitchen-type',
        loadChildren: () => import('./views/kitchen-types/view-kitchen-type/view-kitchen-type.module').then(m => m.ViewKitchenTypeModule),
        canActivate: [AuthGuard],
        data: {
          role: [1, 2]
        }
      },
      {
        path: 'product-category',
        loadChildren: () => import('./views/product-categories/view-product-category/view-product-category.module').then(m => m.ViewProductCategoryModule),
        canActivate: [AuthGuard],
        data: {
          role: [1, 2]
        }
      },
      {
        path: 'product',
        loadChildren: () => import('./views/products/view-product/view-product.module').then(m => m.ViewProductModule),
        canActivate: [AuthGuard],
        data: {
          role: [1, 2]
        }
      },
      {
        path: 'payment-type',
        loadChildren: () => import('./views/payment-types/view-payment-type/view-payment-type.module').then(m => m.ViewPaymentTypeModule),
        canActivate: [AuthGuard],
        data: {
          role: [1, 2]
        }
      },
      {
        path: 'order-status',
        loadChildren: () => import('./views/order-status/view-order-status/view-order-status.module').then(m => m.ViewOrderStatusModule),
        canActivate: [AuthGuard],
        data: {
          role: [1, 2]
        }
      },
    ]
  },
  // { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
