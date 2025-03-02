import { Component } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { Meta } from '../../../models/api-response-paginate.model';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  Params,
  RouterLink,
  UrlSegment,
} from '@angular/router';
import { MetaService } from '../../../services/meta.service';

@Component({
  selector: 'app-paging',
  imports: [CommonModule, RouterLink],
  templateUrl: './paging.component.html',
  styleUrl: './paging.component.css',
})
export class PagingComponent {
  constructor(
    private metaService: MetaService,
    private route: ActivatedRoute,
  ) {}

  meta$!: Observable<Meta>;
  url$!: Observable<UrlSegment[]>;

  private queryParamsSubject = new BehaviorSubject<Params>({});

  ngOnInit() {
    this.meta$ = this.metaService.meta$.pipe(filter((value) => value !== null));
    this.url$ = this.route.url;
    this.route.queryParams.subscribe((v) => {
      this.queryParamsSubject.next(v);
    });
  }

  getQueryParam(extend: Params = {}) {
    return {
      ...this.queryParamsSubject.value,
      ...extend,
    };
  }
}
