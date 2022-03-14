import { Injectable } from '@angular/core';
import { LoginApiService } from '../_middleware/login-api.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private loginAPI:LoginApiService) { }

  loginUser(applicantData: any, self?: any, successCallback?: Function, errorCallback?: Function)
  {
    this.loginAPI.login(applicantData).subscribe(

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
