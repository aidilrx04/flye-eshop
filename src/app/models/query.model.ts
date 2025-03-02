import { Params } from '@angular/router';

export interface QueryModel<T = Params> {
  page?: number;
  sort?: string[];
  filter?: Partial<T>;
  include?: string[];
}
