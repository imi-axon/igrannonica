import { HttpErrorResponse, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegistrationApiService } from '../_middleware/registration-api.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private registrationAPI:RegistrationApiService) { }
  
  
    registerUser(applicantData: any, self?: any, successCallback?: Function, errorCallback?: Function) {
      this.registrationAPI.sendRegistration(applicantData).subscribe(
          
        (response) => {
          
          if(response.body.message == "Success"){
            if(self && successCallback) 
              successCallback(self);
          }
          else
            if(self && errorCallback)
              errorCallback(self,response.body.message);
            
        }
        
      );
    
    }

}