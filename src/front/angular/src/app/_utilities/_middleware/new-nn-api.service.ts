import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiProperties } from '../_constants/api-properties';
import { HeaderUtil } from '../_helpers/http-util';

@Injectable({
  providedIn: 'root'
})
export class NewNnApiService {
  private url:string=apiProperties.url+"/api/projects/"

  constructor(private http:HttpClient) { }

  newNN(nnData:any, id:number): Observable<HttpResponse<any>>{
    let response = this.http.post<any>(this.url + id +"/nn",nnData,
      {
      observe:"response",
      headers: HeaderUtil.jwtOnlyHeaders()
     }
      );
    return response;

  }
}
