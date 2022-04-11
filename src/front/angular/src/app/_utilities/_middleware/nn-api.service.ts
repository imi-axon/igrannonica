import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiProperties } from '../_constants/api-properties';
import { NN } from '../_data-types/models';
import { HeaderUtil } from '../_helpers/http-util';

@Injectable({
  providedIn: 'root'
})
export class NnApiService {

  constructor(private http:HttpClient) { }

  private url:string=apiProperties.url +'/api/projects/';

  projectsNN(projectID:number):Observable<HttpResponse<NN[]>>{
    this.url+=projectID+'/nn';
    let response = this.http.get<NN[]>(this.url,
    {
      observe:"response",
      headers:HeaderUtil.jwtOnlyHeaders()
    });
    return response;
  }
}
