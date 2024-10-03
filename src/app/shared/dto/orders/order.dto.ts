export interface OrderDto {
  id: number;
  customer: string;
  ordersLines: OrderLine[];
  createAt: string;
  updateAt: string;
  status: Status;
}

export interface OrderLine {
  id: number;
  product: string;
  count: number;
  price: number;
}

export enum Status {
  Created = 'Created',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}
