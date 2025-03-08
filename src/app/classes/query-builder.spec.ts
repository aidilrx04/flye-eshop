import { QueryModel } from '../models/query.model';
import { QueryBuilder } from './query-builder';

describe('QueryBuilder', () => {
  it('should return empty string when query is empty', () => {
    const query = {};
    const queryString = QueryBuilder.buildQueryParam(query);
    expect(queryString).toEqual('');
  });
  it('should return useful query string when query is present', () => {
    const query: QueryModel = {
      page: 1,
    };
    const queryString = QueryBuilder.buildQueryParam(query);
    expect(queryString.length > 0).toBeTruthy();
    expect(queryString).toEqual('page=1');
  });
});
