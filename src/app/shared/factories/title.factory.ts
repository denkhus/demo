import { ResolveFn } from '@angular/router';
import { PageOptions } from '../dto/page.dto';

export const titleResolverFactory = (options: PageOptions): ResolveFn<string> => {
  return (route) => {
    let identifier = undefined;
    if (options.identifier) {
      identifier =
        route.paramMap.get(options.identifier) || route.parent?.paramMap.get(options.identifier) || undefined;
    }
    const data = {
      section: options.section,
      action: options.action,
      title: identifier,
    };
    return JSON.stringify(data);
  };
};
