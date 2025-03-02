import { Params } from '@angular/router';

export interface QueryModel<T = { [key: string]: any }> {
  page?: number;
  sort?: string[];
  filter?: Partial<T>;
  include?: string[];
  extras?: Params;
}
