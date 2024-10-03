import { Injectable, signal } from '@angular/core';

@Injectable()
export class TableService {
  public totalCount = signal(0);
  public query = signal('');
  public pageSize = signal(5);
  public pageIndex = signal(1);
  public sortBy = signal<string | 'id'>('id');
  public sortDirection = signal<'asc' | 'desc'>('asc');
}
