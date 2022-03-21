import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiProperties } from '../_constants/api-properties';
import { HeaderUtil } from '../_helpers/http-util';

@Injectable({
  providedIn: 'root'
})
export class RegistrationApiService {
  
  constructor(private http: HttpClient) { }
  
  
  sendRegistration(applicantData: any): Observable<HttpResponse<any>> {
    
    return this.http.post<any>(
      apiProperties.url + "/api/users",
      applicantData,
      {
        observe: 'response',
        headers: HeaderUtil.jwtOnlyHeaders()
      }
    );
  }
  
}
