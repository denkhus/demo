import { ParamMap } from '@angular/router';
import { OperatorFunction, map } from 'rxjs';

interface PageParams {
  pageIndex: number;
  pageSize: number;
}

export const getPageParams = (): OperatorFunction<ParamMap, PageParams> => {
  return (input$) => {
    return input$.pipe(
      map((params) => {
        const pageIndex = params.get('pageIndex');
        const pageSize = params.get('pageSize');
        return {
          pageIndex: pageIndex ? +pageIndex : 1,
          pageSize: pageSize ? +pageSize : 5,
        };
      }),
    );
  };
};
