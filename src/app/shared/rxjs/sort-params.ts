import { ParamMap } from '@angular/router';
import { OperatorFunction, map } from 'rxjs';

interface SortParams<T> {
  sortBy: keyof T;
  sortDirection: 'asc' | 'desc';
}

export const getParamSort = <T>(): OperatorFunction<ParamMap, SortParams<T>> => {
  return (input$) => {
    return input$.pipe(
      map((params) => {
        return {
          sortBy: (params.get('sortBy') || 'id') as keyof T,
          sortDirection: (params.get('sortDirection') || 'asc') as 'asc' | 'desc',
        };
      }),
    );
  };
};
