import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Meta } from '../models/api-response-paginate.model';
import { QueryModel } from '../models/query.model';
import { ActivatedRoute } from '@angular/router';
import { isNumberOr } from '../utils/is-number-or';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private metaSubject = new BehaviorSubject<Meta | null>(null);
  meta$ = this.metaSubject.asObservable();

  private querySubject = new BehaviorSubject<QueryModel>({});
  query$ = this.querySubject.asObservable();

  constructor(private route: ActivatedRoute) {
    const exclude = ['page', 'sort', 'include'];
    this.route.queryParamMap.subscribe((params) => {
      this.querySubject.next({
        page: isNumberOr(params.get('page'), 1),
        filter: params.keys
          .filter((key) => key.startsWith('filter'))
          .map((key) => [key, params.get(key)])
          .reduce<{ [key: string]: any }>((acc, key) => {
            acc[key[0]!] = key[1];
            return acc;
          }, {}),
        sort: (params.get('sort') ?? '').split(','),
        include: (params.get('include') ?? '').split(','),
        extras: params.keys
          .filter((key) => !key.startsWith('filter'))
          .filter((key) => !exclude.includes(key))
          .reduce<{ [key: string]: any }>((acc, key) => {
            acc[key] = params.get(key);
            return acc;
          }, {}),
      });
    });
  }

  setMeta(meta: Meta) {
    this.metaSubject.next(meta);
  }
}
