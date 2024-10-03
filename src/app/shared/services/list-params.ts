export interface ListParams<T> {
  page: number;
  limit: number;
  sort: keyof T;
  order: 'asc' | 'desc';
  query: string;
}
