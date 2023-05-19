import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { CognitoService } from '../services/cognito.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private cognitoService: CognitoService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return from(this.cognitoService.getCurrentSession()).pipe(
      mergeMap((response) => {
        let token = response.getIdToken().getJwtToken();
        request = request.clone({
          setHeaders: {
            Authorization: token,
          },
        });
        console.log('request=', request);
        return next.handle(request);
      })
    );
  }
}
