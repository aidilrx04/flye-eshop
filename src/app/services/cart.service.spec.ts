import { TestBed } from '@angular/core/testing';

import { CartService } from './cart.service';
import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
  TestRequest,
} from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { RemoteCartService } from './remote-cart.service';
import { LocalCartService } from './local-cart.service';
import { cartServiceFactory } from '../providers/cart-service.factory';

// describe('CartService', () => {
//   let service: CartService;
//   let authService: AuthService;
//   let httpMock: HttpTestingController;
//   let req: TestRequest;

//   // beforeEach(() => {
//   //   TestBed.configureTestingModule({
//   //     providers: [
//   //       provideHttpClient(),
//   //       provideHttpClientTesting(),
//   //       {
//   //         provide: CartService,
//   //         useFactory: cartServiceFactory,
//   //       },
//   //     ],
//   //   });
//   //   authService = TestBed.inject(AuthService);
//   //   httpMock = TestBed.inject(HttpTestingController);
//   // });

//   // afterEach(() => {
//   //   TestBed.resetTestingModule();
//   //   // httpMock.verify();
//   // });

//   // it('should be created', () => {
//   //   service = TestBed.inject(CartService);
//   //   expect(service).toBeTruthy();
//   // });

//   // it('should be local cart if unauthenticated', () => {
//   //   authService.init().subscribe(() => {
//   //     service = TestBed.inject(CartService);

//   //     expect(service).toBeInstanceOf(LocalCartService);
//   //   });
//   //   req = httpMock.expectOne(`${environment.apiUrl}/auth/verify`);

//   //   req.flush(null, {
//   //     status: 401,
//   //     statusText: 'Unauthorized',
//   //   });
//   // });
//   // it('should be remote cart if authenticated', () => {
//   //   authService.init().subscribe(() => {
//   //     service = TestBed.inject(CartService);

//   //     expect(service).toBeInstanceOf(RemoteCartService);
//   //   });
//   //   req = httpMock.expectOne(`${environment.apiUrl}/auth/verify`);

//   //   req.flush({ id: 1 });

//   //   httpMock.expectOne(`${environment.apiUrl}/carts`);
//   // });
// });
