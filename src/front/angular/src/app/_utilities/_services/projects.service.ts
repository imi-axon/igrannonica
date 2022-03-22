import { HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../_data-types/models';
import { JWTUtil } from '../_helpers/jwt-util';
import { ProjectsApiService } from '../_middleware/projects-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private projectsApi:ProjectsApiService) { }
  private projekti:Project[]=[];

  userProjects(username:string, self?: any, successCallback?: Function, errorCallback?: Function)
  {
    this.projectsApi.userProjects(username).subscribe(
      
      (response) => {
        if (response.status== HttpStatusCode.Ok) { 
          this.projekti=(response.body==null)?[]:response.body;
          console.log("TACNO");
          console.log(this.projekti);
          if(response.body)
            if (self && successCallback) successCallback(self);

        }
        if(response.status==HttpStatusCode.NotFound)
        {
          console.log("NETACNO");
          JWTUtil.delete();
          if (self && errorCallback) errorCallback(self, response.status);
        }
      }
    
    );
  }
}
