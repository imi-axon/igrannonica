import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationApiService {
  
  readonly APIUrl="https://localhost:7057/api";
  
  constructor(private http: HttpClient) { }
  
  
  sendRegistration(applicantData: any): Observable<HttpResponse<any>> {
    
    return this.http.post<any>(
      this.APIUrl + "/User",
      applicantData,
      {
        observe: 'response'
      }
    );
  }
  
}
