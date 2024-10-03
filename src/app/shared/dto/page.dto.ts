export type PageAction = 'list' | 'create' | 'edit' | 'detail' | 'orders';

export type PageSection = 'customers' | 'not-found' | 'products' | 'orders';

export interface PageOptions {
  description: string;
  section: PageSection[];
  action?: PageAction[];
  identifier?: 'id';
}
