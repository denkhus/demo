import { Routes } from '@angular/router';
import { titleResolverFactory } from './shared/factories/title.factory';

export const routes: Routes = [
  { path: '', redirectTo: '/customers', pathMatch: 'full' },
  {
    path: 'customers',
    title: titleResolverFactory({
      description: 'Customers',
      section: ['customers'],
      action: ['list'],
    }),
    loadComponent: () =>
      import('./customers/customers-list/customers-list.component').then((m) => m.CustomersListComponent),
  },
  {
    path: 'products',
    title: titleResolverFactory({
      description: 'Products',
      section: ['products'],
      action: ['list'],
    }),
    loadComponent: () =>
      import('./products/products-list/products-list.component').then((m) => m.ProductsListComponent),
  },
  {
    path: 'orders',
    title: titleResolverFactory({
      description: 'Orders',
      section: ['orders'],
      action: ['list'],
    }),
    loadComponent: () =>
      import('./products/orders/orders-list/orders-list.component').then((m) => m.OrdersListComponent),
  },
  {
    path: 'customers/:id',
    title: titleResolverFactory({
      description: 'Customer Detail',
      section: ['customers'],
      action: ['detail'],
      identifier: 'id',
    }),
    loadComponent: () =>
      import('./customers/customer-details/customer-details.component').then((m) => m.CustomerDetailsComponent),
  },
  {
    path: 'orders/:id',
    title: titleResolverFactory({
      description: 'Order Detail',
      section: ['orders'],
      action: ['detail'],
      identifier: 'id',
    }),
    loadComponent: () =>
      import('./products/orders/order-details/order-detail.component').then((m) => m.OrderDetailsComponent),
  },
  {
    path: 'products/:id',
    title: titleResolverFactory({
      description: 'Product Detail',
      section: ['products'],
      action: ['detail'],
      identifier: 'id',
    }),
    loadComponent: () =>
      import('./products/product-detail/product-detail.component').then((m) => m.ProductDetailsComponent),
  },
  {
    path: '**',
    title: titleResolverFactory({
      description: 'Not found',
      section: ['not-found'],
    }),
    loadComponent: () => import('./not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
