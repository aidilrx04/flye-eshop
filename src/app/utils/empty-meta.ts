import { Meta } from '../models/api-response-paginate.model';

export function emptyMeta(): Meta {
  return {
    current_page: 0,
    from: 0,
    last_page: 0,
    links: [],
    path: '',
    per_page: 0,
    to: 0,
    total: 0,
  };
}
