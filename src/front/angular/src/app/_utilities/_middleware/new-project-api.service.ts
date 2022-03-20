import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiProperties } from '../_constants/api-properties';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewProjectApiService {
  private url:string=apiProperties.url + "/api/projects"

  constructor(private http:HttpClient) { }

  createNewProject(formData:any) :Observable<HttpResponse<any>>
  {
    console.log("saljem");
    return this.http.post<any>(this.url,formData,{observe:"response"});
  }
}
