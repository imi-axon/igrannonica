import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiProperties } from '../_constants/api-properties';

@Injectable({
  providedIn: 'root'
})
export class DatasetApiService {
  
  constructor(private http:HttpClient) { }
  
  // POST DATASET api/projects/{id}/dataset
  public postCSV(csvStr:String, project_id:number): Observable<HttpResponse<any>>{
    return this.http.post<any>(
      apiProperties.url + '/api/projects/' + project_id + '/dataset',
      { 
        csvstring:csvStr 
      },
      { 
        observe: 'response' 
      }
    );
  }
  
  
  // GET DATASET api/projects/{id}/dataset
  public getCSV(project_id:number): Observable<HttpResponse<any>>{
    return this.http.get<any>(
      apiProperties.url + '/api/projects/' + project_id + '/dataset',
      {
        observe: 'response'
      }
    )
  }
  
  
  
  
}
