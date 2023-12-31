import { HttpErrorResponse, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { OwnerInfo, Project } from '../_data-types/models';
import { JWTUtil } from '../_helpers/jwt-util';
import { ProjectsApiService } from '../_middleware/projects-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private projectsApi: ProjectsApiService) { }
  @Input() public projekti: Project[] = [];

  userProjects(username: string, self?: any, successCallback?: Function, notFoundCallback?: Function) {
    this.projectsApi.userProjects(username).subscribe(
      {
        next: (response) => {
          if (response.status == HttpStatusCode.Ok) {
            this.projekti = (response.body == null) ? [] : response.body;
            //  console.log("TACNO");
            //console.log(this.projekti);
            if (response.body)
              if (self && successCallback) 
                successCallback(self, this.projekti);

          }
        },
        error: (error) => {
          if (error.status == HttpStatusCode.NotFound)
            if (self && notFoundCallback) 
              notFoundCallback(self, []);
        }
      }
    );
  }

  removeProject(projectId: number, self?: any, successCallback?: Function, unauthorizedCallback?: Function, badRequestCallback?: Function) {
    this.projectsApi.removeProject(projectId).subscribe(
      { 
        next: function (response: HttpResponse<any>) {
          
          
          
          if (response.status == HttpStatusCode.Ok)
            if (self && successCallback){
              successCallback(self);
            }
          
          if (response.status == HttpStatusCode.Unauthorized)
            if (self && unauthorizedCallback)
              unauthorizedCallback(self);
              
          if (response.status == HttpStatusCode.BadRequest)
            if (self && badRequestCallback)
              badRequestCallback(self); 
        }
      }
    )
  }

  editProject(projectId: number, edits: any){
    this.projectsApi.editProject(projectId, edits).subscribe(
      (response) => {
        console.log(response);
      }
    );
  }

  getProject(projectId: number, self?: any, successCallback?: Function, errorCallback?: Function) {
    this.projectsApi.getProject(projectId).subscribe(
      (response) => {

        if (response.status == HttpStatusCode.Ok)
          if (self && successCallback)
            successCallback(self, response.body);


      }
    )
  }

  getProjects(self?: any, successCallback?: Function, notFoundCallback?: Function) {
    this.projectsApi.getProjects().subscribe(
      (response) => {
        if (response.status == HttpStatusCode.Ok)
          this.projekti = (response.body == null) ? [] : response.body;
        
        if(response.body)
          if (self && successCallback)
            successCallback(self, this.projekti);
            
        if(response.status == HttpStatusCode.NotFound)
          if(self && notFoundCallback)
            notFoundCallback(self, []);
      }
    )

  }
  
  
  getOwner(projectId: number, self?: any, successCallback?: Function){
    this.projectsApi.getOwner(projectId).subscribe(
      (response) => {
        if (response.status == HttpStatusCode.Ok && response.body)
          if(self && successCallback){
            let owner: OwnerInfo = response.body;
            successCallback(self, owner);
          }
      }
    )
  }


}
