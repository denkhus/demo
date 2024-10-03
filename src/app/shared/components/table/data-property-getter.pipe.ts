import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'dataPropertyGetter',
})
export class DataPropertyGetterPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(object: any, keyName: string): unknown {
    return object[keyName];
  }
}
