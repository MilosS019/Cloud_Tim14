import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  public registerUser(user: User): Observable<any> {
    const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    const requestOptions = { headers: myHeaders };
    // make API call with parameters and use promises to get response
    return this.http.post(
      'https://u6w8pnhr47.execute-api.eu-central-1.amazonaws.com/dev/users',
      user,
      requestOptions
    );
  }

  public login(loginRequest: LoginRequest) {
    const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    const requestOptions = { headers: myHeaders };

    // make API call with parameters and use promises to get response
    return this.http
      .post(environment + 'login', loginRequest, requestOptions)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error: any) => {
          return of(error);
        })
      );
  }

  public fetchUsers() {
    return this.http.get(
      'https://u6w8pnhr47.execute-api.eu-central-1.amazonaws.com/dev/users'
    );
  }
}
