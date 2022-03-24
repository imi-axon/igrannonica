import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiProperties } from '../_constants/api-properties';
import { Observable } from 'rxjs';
import { HeaderUtil } from '../_helpers/http-util';

@Injectable({
  providedIn: 'root'
})
export class NewProjectApiService {
  private url:string=apiProperties.url + "/api/projects"

  constructor(private http:HttpClient) { }

  createNewProject(projectData:any) :Observable<HttpResponse<any>>
  {
    console.log("saljem");
    console.log(projectData);

    let response = this.http.post<any>(this.url,projectData,
      {
      observe:"response",
      headers: HeaderUtil.jwtOnlyHeaders()
     }
      );
    return response;
  }
}
