import { Injectable } from '@angular/core';
import { RegistrationRequest } from '../models/regisstrationRequest.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class RegistrationRequestService {
  constructor(private http: HttpClient) {}

  public saveRegistrationRequest(request: RegistrationRequest) {
    return this.http.post(
      `${environment.baseUrl}save/registration-request`,
      request
    );
  }

  public removeRegistrationRequest(invited_user_email: string) {
    let obj = { invited_user_email: invited_user_email };
    return this.http.delete(`${environment.baseUrl}registration-request`, {
      body: obj,
    });
  }

  public acceptRequest(invited_user_email: string) {
    let obj = { invited_user_email: invited_user_email };
    return this.http.post(
      `${environment.baseUrl}accept-registration-request`,
      obj
    );
  }

  public getRegistrationRequests(): Observable<Array<RegistrationRequest>> {
    return this.http.get<Array<RegistrationRequest>>(
      `${environment.baseUrl}registration-request`
    );
  }

  public sendInvite(receiverEmail: string) {
    let obj = { receiver_email: receiverEmail };
    return this.http.post(`${environment.baseUrl}send-invite`, obj);
  }
}
