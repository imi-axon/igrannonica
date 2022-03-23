import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewProjectApiService } from '../_middleware/new-project-api.service';

@Injectable({
  providedIn: 'root'
})
export class NewProjectService {

  constructor(private newProjectApi:NewProjectApiService) { }

  newProject(projectData: any, self?: any, successCallback?: Function, errorCallback?: Function)
  {
    this.newProjectApi.createNewProject(projectData).subscribe(
      (response:HttpResponse<any>) => {
   
        // OK (Success)
          if(response.status== HttpStatusCode.Ok){
             if(self && successCallback) 
                successCallback(self);
          }
          
         // Not Acceptable
          if(response.status == HttpStatusCode.NotAcceptable){
              if(self && errorCallback)
              errorCallback(self, response.body.message);
          }
          
        // Unauthorized
          if(response.status == HttpStatusCode.Unauthorized){
            if(self && errorCallback){
              errorCallback(self, response.body.message);  
        }}
         // Forbidden
         if(response.status == HttpStatusCode.Forbidden){
          if(self && errorCallback){
            errorCallback(self, response.body.message);  
      }}
      }
    );
    
  }
}
