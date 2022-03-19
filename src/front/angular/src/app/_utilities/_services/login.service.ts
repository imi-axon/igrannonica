import { HttpErrorResponse, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JWT_HEADER_NAME } from '../_data-types/vars';
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
      (response) => {
        if (response.status == 200) {
          JWTUtil.store(response.headers.get(JWT_HEADER_NAME));
          console.log(JWT_HEADER_NAME)
          if (self && successCallback) successCallback(self);
        }
        else {
          JWTUtil.delete();
          if (self && errorCallback)
            errorCallback(self, response.body.message);
        }
      }

    );

  }
}
