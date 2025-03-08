import { TestBed } from '@angular/core/testing';
import {
  LoadingPipe,
  ObsState,
  ObsWithState,
  ObsWithStatus,
} from './loading.pipe';
import { of, throwError } from 'rxjs';

describe('LoadingPipe', () => {
  let pipe: LoadingPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingPipe],
    });

    pipe = TestBed.inject(LoadingPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform an observable and set loading to true initially', (done) => {
    const source$ = of<ObsWithState<string>>({
      type: ObsState.FINISH,
      data: 'Test Data',
    });

    const result$ = pipe.transform(source$);

    const results: ObsWithStatus<string>[] = [];
    result$.subscribe({
      next: (value) => {
        results.push(value);
      },
      complete: () => {
        expect(results[0]).toEqual({ loading: true }); // Initial state
        expect(results[1]).toEqual({
          loading: false,
          data: 'Test Data',
          error: undefined,
        }); // Transformed state
        done();
      },
    });
  });

  it('should set error when the observable emits an error state', (done) => {
    const error = { message: 'Custom error' };
    const source$ = of<ObsWithState<string>>({ type: ObsState.ERROR, error });

    const result$ = pipe.transform(source$);

    const results: ObsWithStatus<string>[] = [];
    result$.subscribe({
      next: (value) => {
        results.push(value);
      },
      complete: () => {
        expect(results[0]).toEqual({ loading: true });
        expect(results[1]).toEqual({ loading: false, error, data: undefined });
        done();
      },
    });
  });

  it('should handle errors thrown from the observable', (done) => {
    const source$ = throwError(() => new Error('Network error'));

    const result$ = pipe.transform(source$);

    const results: ObsWithStatus<string>[] = [];

    result$.subscribe({
      next: (value) => {
        results.push(value);
      },
      complete: () => {
        expect(results[0]).toEqual({ loading: true });
        expect(results[1]).toEqual({
          loading: false,
          error: new Error('Network error'),
        });
        done();
      },
    });
  });
});
