import { HttpErrorResponse, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JWTUtil } from '../_helpers/jwt-util';
import { LoginApiService } from '../_middleware/login-api.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private loginAPI: LoginApiService) { }

  loginUser(applicantData: any, self?: any, successCallback?: Function, errorCallback?: Function) {
    this.loginAPI.login(applicantData).subscribe(

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
