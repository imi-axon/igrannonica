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

  constructor(private http:HttpClient) { }

  private url: string = apiProperties.url + "/api";
  
  userProjects(username:string):Observable<HttpResponse<Project[]>>
  {
    console.log("moji projekti");
    let response = this.http.get<Project[]>( this.url + `/users/${username}/projects`,
      {
        observe:"response",
        headers:HeaderUtil.jwtOnlyHeaders()
      });
      return response;
  }
  
  removeProject(projectId: number){
    let response = this.http.delete( 
      this.url + "/projects/" + projectId + "/delete",
      {
        observe: "response",
        responseType: "text",
        headers:HeaderUtil.jwtOnlyHeaders()
      }
    )
    return response;
  }
  
  
  
}