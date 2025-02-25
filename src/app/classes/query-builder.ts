import { QueryModel } from '../models/query.model';

export class QueryBuilder {
  static buildQueryParam(query: QueryModel): string {
    const queryParam = new URLSearchParams();

    const { page, sort, filter } = query;

    if (page !== undefined) {
      queryParam.append('page', page!.toString());
    }

    if (sort) {
      queryParam.append(
        'sort',
        `${sort.order === 'DESC' ? '-' : ''}${sort.field}`,
      );
    }

    if (filter) {
      const filterArr = Object.entries(filter);
      for (const entry of filterArr) {
        queryParam.append(`filter[${entry[0]}]`, entry[1].toString());
      }
    }

    return queryParam.toString();
  }
}
