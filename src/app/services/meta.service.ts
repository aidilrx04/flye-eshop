import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Meta } from '../models/api-response-paginate.model';
import { QueryModel } from '../models/query.model';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private metaSubject = new BehaviorSubject<Meta | null>(null);
  meta$ = this.metaSubject.asObservable();

  private querySubject = new BehaviorSubject<QueryModel>({});
  query$ = this.querySubject.asObservable();

  // constructor(private route: ActivatedRoute) {
  // this.route.queryParamMap.subscribe((value) => {
  //   this.querySubject.next({
  //     page: Number(value.get('page')) ?? 1,
  //   });
  // });
  // }

  setMeta(meta: Meta) {
    this.metaSubject.next(meta);
  }
}
