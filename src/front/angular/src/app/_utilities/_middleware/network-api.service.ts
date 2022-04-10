import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiProperties } from '../_constants/api-properties';
import { HeaderUtil } from '../_helpers/http-util';

@Injectable({
  providedIn: 'root'
})
export class NetworkApiService {

  private url: string = apiProperties.url + "/api/projects/";
  constructor(private http:HttpClient) { }  

  public GetNetwork(projectID: number, networkID: number):Observable<any>
  {
    let response = this.http.get<any>(
      this.url + projectID + "/nn/" + networkID,
      {
        observe:"response",
        headers:HeaderUtil.jwtOnlyHeaders()
      });
    return response;
  }
}
