import { HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JWTUtil } from '../_helpers/jwt-util';
import { UserApiService } from '../_middleware/user-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private userAPI:UserApiService) { }
  
  
    Register(applicantData: any, self?: any, successCallback?: Function, badRequestCallback?: Function, forbiddenCallback?: Function) {
      this.userAPI.Register(applicantData).subscribe(
          
        (response) => {
          
          if(response.status == HttpStatusCode.Ok)
            if(self && successCallback) 
              successCallback(self);
          
          if(response.status == HttpStatusCode.BadRequest)
            if(self && badRequestCallback)
              badRequestCallback(self,response.body.message);
          
          if(response.status == HttpStatusCode.Forbidden)
            if(self && forbiddenCallback)
              forbiddenCallback(self, response.body.message);
          
        }
        
      );
    }
    
    loginUser(applicantData: any, self?: any, successCallback?: Function, errorCallback?: Function) {
      this.userAPI.login(applicantData).subscribe(
  
        // Success
        (response:any) => {
          if (response.status== HttpStatusCode.Ok) { 
            console.log("TACNO");
            JWTUtil.store(response.body.v);
            if (self && successCallback) successCallback(self);
          }
          if(response.status==HttpStatusCode.BadRequest)
          {
            console.log("NETACNO");
            JWTUtil.delete();
            if (self && errorCallback) errorCallback(self, response.body.message);
          }
          if(response.status==HttpStatusCode.Forbidden)
          {
            console.log("NETACNO");
            JWTUtil.delete();
            if (self && errorCallback)
              errorCallback(self, response.body.message); 
          }
        }
      
      );
  
    }
    

}