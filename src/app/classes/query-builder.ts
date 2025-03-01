import { QueryModel } from '../models/query.model';

export class QueryBuilder {
  static buildQueryParam(query: QueryModel): string {
    const queryParam = new URLSearchParams();

    const { page, sort, filter, include: includes } = query;

    if (page !== undefined) {
      queryParam.append('page', page!.toString());
    }

    if (sort) {
      queryParam.append('sort', sort.join(','));
    }

    if (filter) {
      const filterArr = Object.entries(filter);
      for (const entry of filterArr) {
        // queryParam.append(`filter[${entry[0]}]`, entry[1].toString());
        queryParam.set(`filter[${entry[0]}]`, entry[1].toString());
      }
    }

    if (includes) {
      queryParam.append('include', includes.join(','));
    }

    let queryString = queryParam.toString();

    // replace encoded [ and ] to original [ and ]
    // since query-builder require the use of it
    queryString = queryString.replaceAll('filter%5B', 'filter[');
    queryString = queryString.replaceAll('%5D=', ']=');

    return queryString;
  }
}
