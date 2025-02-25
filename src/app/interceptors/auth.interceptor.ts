import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // console.log('token is', token);

  if (!token) return next(req);

  return next(
    req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    }),
  );
};
