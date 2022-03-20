import { Injectable } from '@angular/core';
import { NewProjectApiService } from '../_middleware/new-project-api.service';

@Injectable({
  providedIn: 'root'
})
export class NewProjectService {

  constructor(private newProjectApi:NewProjectApiService) { }

  newProject(applicantData: any, self?: any, successCallback?: Function, notAcceptableCallback?: Function,unauthorizedCallback?: Function)
  {
    this.newProjectApi.createNewProject(applicantData).subscribe(

      (response) => {

          // OK (Success)
          if(response.status == 200)
            if(self && successCallback) 
              successCallback(self);
          
          // Not Acceptable
          if(response.status == 406)
            if(self && notAcceptableCallback)
              notAcceptableCallback(self, response.body.message);
          
          // Unauthorized
          if(response.status == 401)
            if(self && unauthorizedCallback)
              unauthorizedCallback(self, response.body.message);
        }
    );
    
  }
}
