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

  public saveUser(user: User): Observable<any> {
    return this.http.post(
      'https://u6w8pnhr47.execute-api.eu-central-1.amazonaws.com/dev/users',
      user
    );
  }

  public fetchUsers() {
    return this.http.get(
      'https://u6w8pnhr47.execute-api.eu-central-1.amazonaws.com/dev/users'
    );
  }
}
