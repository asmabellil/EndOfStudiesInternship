import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentToken } from 'src/app/store/user/user.selector';
import { AppState } from 'src/app/store/app.state';

@Injectable()
export class RequestsInterceptor implements HttpInterceptor {

  constructor(private store: Store<AppState>
) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the token from wherever it is stored (e.g. local storage, cookie, etc.)
    return this.store.select(selectCurrentToken).pipe(
      // Use switchMap to transform the token into the modified request
      switchMap((token: string) => {
        // Clone the request and add the token to the headers
        const modifiedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        // Pass the modified request to the next interceptor or the backend
        return next.handle(modifiedRequest);
      })
    );
  }


  // intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  //   // Get the token from wherever it is stored (e.g. local storage, cookie, etc.)
  //   const token = 'your_token_here';

  //   // Clone the request and add the token to the headers
  //   const modifiedRequest = request.clone({
  //     setHeaders: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   });

  //   // Pass the modified request to the next interceptor or the backend
  //   return next.handle(modifiedRequest);
  // }
}
