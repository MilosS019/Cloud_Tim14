import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { CognitoService } from '../services/cognito.service';
import { environment } from '../environments/environments';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private cognitoService: CognitoService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Provera da li se zahtev odnosi na specifični endpoint koji želite da preskočite
    if (request.url.includes(`${environment.baseUrl}users`)) {
      // Ako je zahtev za specifični endpoint, ne primenjuj interceptor
      return next.handle(request);
    }

    // Ako nije zahtev za specifični endpoint, primeni interceptor
    return from(this.cognitoService.getCurrentSession()).pipe(
      mergeMap((response) => {
        let token = response.getIdToken().getJwtToken();
        // Postavljanje Authorization zaglavlja samo ako nije zahtev za specifični endpoint
        const headers = new HttpHeaders().set('Authorization', token);
        request = request.clone({ headers });
        console.log('request=', request);
        return next.handle(request);
      })
    );
  }
}
