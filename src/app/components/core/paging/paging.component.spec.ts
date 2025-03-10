import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagingComponent } from './paging.component';
import { MetaService } from '../../../services/meta.service';
import { ActivatedRoute, Params, UrlSegment } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('PagingComponent', () => {
  let component: PagingComponent;
  let fixture: ComponentFixture<PagingComponent>;
  let mockMetaService: jasmine.SpyObj<MetaService>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  beforeEach(async () => {
    mockMetaService = jasmine.createSpyObj('MetaService', ['meta$']);
    mockMetaService.meta$ = of({ total: 10 } as any); // Mock meta data

    mockActivatedRoute = {
      url: of([new UrlSegment('test', {})]),
      queryParams: new BehaviorSubject<Params>({ page: '1' }),
    };

    await TestBed.configureTestingModule({
      imports: [PagingComponent],
      providers: [
        provideHttpClient(),
        { provide: MetaService, useValue: mockMetaService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize meta$ with metaService.meta$', (done) => {
    component.meta$.subscribe((meta) => {
      expect(meta).toEqual({ total: 10 } as any);
      done();
    });
  });

  it('should initialize url$ with route.url', (done) => {
    component.url$.subscribe((url) => {
      expect(url).toEqual([new UrlSegment('test', {})]);
      done();
    });
  });

  it('should update queryParamsSubject when query params change', () => {
    expect(component.getQueryParam()).toEqual({ page: '1' });

    (mockActivatedRoute.queryParams as BehaviorSubject<Params>).next({
      page: '2',
      sort: 'asc',
    });

    expect(component.getQueryParam()).toEqual({ page: '2', sort: 'asc' });
  });

  it('should merge existing and new query params in getQueryParam()', () => {
    expect(component.getQueryParam({ filter: 'new' })).toEqual({
      page: '1',
      filter: 'new',
    });
  });
});
