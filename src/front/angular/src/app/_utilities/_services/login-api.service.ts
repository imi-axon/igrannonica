import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiProperties } from '../_constants/api-properties';

@Injectable({
  providedIn: 'root'
})
export class LoginApiService {

  private url: string = apiProperties.url+"/api/login";

  constructor(private http:HttpClient) { }

  login(formData:any)
  {
    console.log("saljem")
    return this.http.post(this.url,formData)
  }

}
