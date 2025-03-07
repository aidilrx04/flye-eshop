import { TestBed } from '@angular/core/testing';

import { MetaService } from './meta.service';
import { ActivatedRoute, ParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject, first, firstValueFrom, map } from 'rxjs';
import { Meta } from '../models/api-response-paginate.model';

describe('MetaService', () => {
  let service: MetaService;
  let routeMock: any;

  beforeEach(() => {
    routeMock = {
      queryParamMap: new BehaviorSubject(
        (() => {
          const map = new Map<string, string>();
          return {
            get: (key: string) => map.get(key) || undefined,
            keys: Array.from(map.keys()),
          };
        })(),
      ),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: routeMock,
        },
      ],
    });
    service = TestBed.inject(MetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set meta data when setMeta is called', async () => {
    expect(await firstValueFrom(service.meta$)).toEqual(null);

    const meta: Meta = {
      current_page: 0,
      from: 0,
      last_page: 0,
      links: [],
      path: '',
      per_page: 0,
      to: 0,
      total: 0,
    };
    service.setMeta(meta);

    expect(await firstValueFrom(service.meta$)).toEqual(meta);
  });

  it('should update query when page change', async () => {
    expect(await firstValueFrom(service.query$)).toEqual({
      filter: {},
      sort: [],
      page: 1,
      include: [],
    });

    routeMock.queryParamMap.next(
      (() => {
        const map = new Map<string, string>([
          ['page', '1'],
          ['testfilter', '123'],
          ['filter2', '123'],
          ['sort', 'name'],
          ['include', 'bob'],
        ]);
        return {
          get: (key: string) => map.get(key) || undefined,
          keys: Array.from(map.keys()),
        };
      })(),
    );

    const val = await firstValueFrom(service.query$);
    console.log(val);
    expect(val).toEqual({
      page: 1,
      filter: {
        testfilter: '123',
        filter2: '123',
      },
      sort: ['name'],
      include: ['bob'],
    });
  });
});
