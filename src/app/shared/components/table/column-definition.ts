import { TemplateRef } from '@angular/core';

export interface ColumnDefinition {
  name: string;
  dataKey: string;
  position?: 'right' | 'left';
  isSortable?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templateRef: TemplateRef<any> | null;
}
