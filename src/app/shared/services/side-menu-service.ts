import { Injectable } from '@angular/core';

export interface Link {
  text: string;
  path?: string;
  iconUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SideMenuService {
  public getLinks(): Link[] {
    return [
      {
        text: 'Customers',
        path: '/customers',
      } as Link,
      {
        text: 'Products',
        path: '/products',
      } as Link,
      {
        text: 'Orders',
        path: '/orders',
      } as Link,
    ];
  }
}
