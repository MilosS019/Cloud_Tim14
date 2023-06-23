import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(private http: HttpClient) {}

  public addPermission(permissionObj: any) {
    // permissionObj = {
    //   granted_user: 'ivanmartic311@gmail.com',
    //   file_path: 'album',
    // };
    return this.http.post(
      `${environment.baseUrl}file-permission`,
      permissionObj
    );
  }

  public removePermission(permissionObj: any) {
    // permissionObj = {
    //   granted_user: 'ivanmartic311@gmail.com',
    //   file_path: 'album',
    // };
    return this.http.delete(`${environment.baseUrl}file-permission`, {
      body: permissionObj,
    });
  }
}
