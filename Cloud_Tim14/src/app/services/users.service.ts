import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl: string =
    'https://4lkaqfrwb8.execute-api.eu-north-1.amazonaws.com/dev';

  constructor(private http: HttpClient) {}

  public registerUser(user: User) {
    const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    const requestOptions = { headers: myHeaders };

    // make API call with parameters and use promises to get response
    return this.http
      .post(this.baseUrl + '/register', user, requestOptions)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error: any) => {
          return of(error);
        })
      );
  }

  public login(loginRequest: LoginRequest) {
    const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    const requestOptions = { headers: myHeaders };

    // make API call with parameters and use promises to get response
    return this.http
      .post(this.baseUrl + '/login', loginRequest, requestOptions)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error: any) => {
          return of(error);
        })
      );
  }
}
