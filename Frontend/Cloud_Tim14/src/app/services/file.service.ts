import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FileService {
  
  constructor(private http: HttpClient) { 
  }

  public uploadFolder (fileObj:any): Observable<any> {
    return this.http.post(`${environment.baseUrl}upload-folder`, fileObj);
  }

  
  public renameFolder (folderNames:any): Observable<any> {
    return this.http.post(`${environment.baseUrl}rename-folder`, folderNames);
  }
  
  public uploadFile (fileObj:any): Observable<any> {
    return this.http.post(`${environment.baseUrl}upload-file`, fileObj);
  }
  
  public uploadMetaData(fileInfoParams: any): Observable<any> {
    return this.http.post(`${environment.baseUrl}upload-metadata`, fileInfoParams);
  }

  public getFolders(): Observable<any> {
    return this.http.get(`${environment.baseUrl}folders`);
  }

  public getMetaData(filepath:string):Observable<any>{
    return this.http.put(`${environment.baseUrl}metadata`, {"path":filepath});
  }

  public getSharedMetaData(filepath:string):Observable<any>{
    return this.http.put(`${environment.baseUrl}shared-metadata`, {"path":filepath});
  }

  public getFiles(filepath:string):Observable<any>{
    return this.http.put(`${environment.baseUrl}files`, {"path": filepath})
  }

  public getAllFiles(filepath:string):Observable<any>{
    return this.http.put(`${environment.baseUrl}all-files`, {"path": filepath})
  }

  public renameMetaData(fileParams:any):Observable<any>{
    return this.http.put(`${environment.baseUrl}rename-metadata`, fileParams)
  }

  public updateMetaData(fileParams:any):Observable<any>{
    return this.http.put(`${environment.baseUrl}update-metadata`, fileParams)
  }

  public moveFile(fileParams:any):Observable<any>{
    return this.http.put(`${environment.baseUrl}move-file`, fileParams)
  }

  public downloadFiles(filepath:string):Observable<any>{
    return this.http.put(`${environment.baseUrl}download`, {"path": filepath});
  } 

  public downloadSharedFile(filepath:string):Observable<any>{
    return this.http.put(`${environment.baseUrl}download-shared`, {"path": filepath});
  } 

  public removeFile(filepath:string):Observable<any>{
    return this.http.put(`${environment.baseUrl}remove-file`, {"path": filepath});
  }

  public deleteAlbum(filepath:string):Observable<any>{
    return this.http.put(`${environment.baseUrl}remove-folder`, {"path": filepath});
  }

  public getSharedFiles():Observable<any>{
    return this.http.get(`${environment.baseUrl}get-shared-files`);
  }

  public getLogedInEmail():Observable<any>{
    return this.http.get(`${environment.baseUrl}get-email`);
  }

  public test():Observable<any>{
    return this.http.post(`${environment.baseUrl}step-test`,{"proba":"proba"});
  }

  
}
