import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiProperties } from '../_constants/api-properties';
import { HeaderUtil } from '../_helpers/http-util';
import { UserRegistration } from '../_data-types/models';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  
  constructor(private http: HttpClient) { }
  
  
  Register(applicantData: any): any {
    
    let response = this.http.post(
      apiProperties.url + "/api/users",
      applicantData,
      {
        observe: 'response',
        responseType: "text",
        headers: HeaderUtil.jwtOnlyHeaders()
      }
    );
    console.log(response);
    return response;
  }

  login(formData: any) {
    console.log("saljem")
    let response = this.http.post<any>(apiProperties.url + "/api/users/login", formData,
      {
        observe: "response",
        headers: HeaderUtil.jwtOnlyHeaders()
      });

    return response;
  }
  verify(token:any):Observable<any>{
    return this.http.get<any>(apiProperties.url+"/api/users/"+token);
  }

  changepass(token:any, password:string):Observable<any>{
    const body = {actions: password};
    return this.http.put<any>(apiProperties.url+"/api/users/"+token+"/editpassword", body);
  }

  sendemail(username:any):Observable<any>{
    return this.http.post<any>(apiProperties.url+"/api/users/"+username+"/changepass", null);
  }

  edituser1(model:any):Observable<any>{
    //return this.http.put<any>(apiProperties.url+"/api/users/edit-user", model);
    let response = this.http.put<any>(apiProperties.url + "/api/users/edit/user", model,
      {
        observe: "response",
        headers: HeaderUtil.jwtOnlyHeaders()
      });
    return response
  }
  edituser2(model:any):Observable<any>{
    //return this.http.put<any>(apiProperties.url+"/api/users/edit-user", model);
    let response = this.http.put<any>(apiProperties.url + "/api/users/edit/email", model,
      {
        observe: "response",
        headers: HeaderUtil.jwtOnlyHeaders()
      });
    return response
  }
  edituser3(model:any):Observable<any>{
    //return this.http.put<any>(apiProperties.url+"/api/users/edit-user", model);
    let response = this.http.put<any>(apiProperties.url + "/api/users/edit/password", model,
      {
        observe: "response",
        headers: HeaderUtil.jwtOnlyHeaders()
      });
    return response
  }
  edituser4(model:any):Observable<any>{
    //return this.http.put<any>(apiProperties.url+"/api/users/edit-user", model);
    let response = this.http.put<any>(apiProperties.url + "/api/users/edit/photo", model,
      {
        observe: "response",
        headers: HeaderUtil.jwtOnlyHeaders()
      });
    return response
  }
  getinfo(username:any):Observable<HttpResponse<UserRegistration>>
  {
    let response = this.http.get<UserRegistration>(apiProperties.url+"/api/users/"+`${username}`+"/getuser",
      {
        observe:"response",
        headers:HeaderUtil.jwtOnlyHeaders()
      });
      return response;
  }

  getimage(username:any):any
  {
    let response = this.http.get(apiProperties.url+"/api/users/"+`${username}`+"/getimage",
    {
      observe:"response",
      responseType : "blob",
      headers:HeaderUtil.jwtOnlyHeaders()
    });
    return response;
  }
}
