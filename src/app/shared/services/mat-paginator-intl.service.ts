import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class MatPaginationIntlService extends MatPaginatorIntl {
  constructor() {
    super();
  }

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return '0 ' + 'of' + ' ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize > length ? (Math.ceil(length / pageSize) - 1) * pageSize : page * pageSize;

    const endIndex = Math.min(startIndex + pageSize, length);
    return startIndex + 1 + ' - ' + endIndex + ' ' + 'of' + ' ' + length;
  };

  translateLabels(): void {
    this.firstPageLabel = 'first page';
    this.itemsPerPageLabel = 'per page';
    this.lastPageLabel = 'last page';
    this.nextPageLabel = 'next page';
    this.previousPageLabel = 'previous-page';
    this.changes.next(); // Fire a change event to make sure that the labels are refreshed
  }
}
