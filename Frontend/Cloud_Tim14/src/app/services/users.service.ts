import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  public saveUser(user: any): Observable<any> {
    user = {
      email: 'value1',
      password: 'value1',
      name: 'value1',
      lastname: 'value1',
      birthday: 'value1',
    };
    return this.http.post(`${environment.baseUrl}users`, user);
  }

  public fetchUsers() {
    return this.http.get(`${environment.baseUrl}users`);
  }
}
