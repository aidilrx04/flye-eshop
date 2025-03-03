import { Pipe, PipeTransform } from '@angular/core';
import { catchError, isObservable, map, Observable, of, startWith } from 'rxjs';
import { ErrorModel } from '../models/error.model';

export interface ObsWithStatus<T> {
  loading?: boolean;
  data?: T;
  error?: ErrorModel;
}

export enum ObsState {
  START,
  FINISH,
  ERROR,
}
export interface ObsWithState<T> {
  type: ObsState;
  data?: T;
  error?: ErrorModel;
}

const DEFAULT_ERROR: ErrorModel = {
  message: 'Something went wrong',
};

@Pipe({
  name: 'loading',
})
export class LoadingPipe implements PipeTransform {
  transform<T = any>(
    value: Observable<ObsWithState<T>>,
  ): Observable<ObsWithStatus<T>> {
    return value.pipe(
      map((value) => {
        return {
          loading: value.type === ObsState.START,
          error: value.type === ObsState.ERROR ? value.error : DEFAULT_ERROR,
          data: value.data,
        };
      }),
      startWith({ loading: true }),
      catchError((error) =>
        of({
          loading: false,
          error: typeof error === 'object' ? error : DEFAULT_ERROR,
        }),
      ),
    );
  }
}
