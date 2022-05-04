import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiProperties } from '../_constants/api-properties';
import { OwnerInfo, Project } from '../_data-types/models';
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
  
  getProject(projectId: number){
    let response = this.http.get(
      this.url + "/projects/" + projectId,
      {
        observe: "response",
        responseType: "json",
        headers:HeaderUtil.jwtOnlyHeaders()
      }
    )
    return response;
  }

  getProjects():Observable<HttpResponse<Project[]>>{
    let response = this.http.get<Project[]>(
      this.url + "/users/public_projects",
      {
        observe: "response",
        headers:HeaderUtil.jwtOnlyHeaders()
      }
    );
    return response;
  }
  
  getOwner(projectId: number):Observable<any>{
    let response = this.http.get<any>(
      this.url + "/projects/" + projectId + "/getuser",
      {
        observe: "response",
        headers: HeaderUtil.jwtOnlyHeaders()
      }
    );
    return response;
  }
  
  
  
}