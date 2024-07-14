import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentToken } from 'src/app/store/user/user.selector';
import { AppState } from 'src/app/store/app.state';

@Injectable()
export class RequestsInterceptor implements HttpInterceptor {

  constructor(private store: Store<AppState>
) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.store.select(selectCurrentToken).pipe(
      take(1),
      switchMap((token: string) => {
        const modifiedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next.handle(modifiedRequest);
      })
    );
  }
}
