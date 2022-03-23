import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiProperties } from '../_constants/api-properties';
import { Project } from '../_data-types/models';
import { HeaderUtil } from '../_helpers/http-util';

@Injectable({
  providedIn: 'root'
})
export class ProjectsApiService {

  private url: string = apiProperties.url + "/api/users/";
  constructor(private http:HttpClient) { }

  userProjects(username:string):Observable<HttpResponse<Project[]>>
  {
    console.log("moji projekti");
    let response = this.http.get<Project[]>(this.url+`${username}/projects`,
      {
        observe:"response",
        headers:HeaderUtil.jwtOnlyHeaders()
      });
      return response;
  }
}
