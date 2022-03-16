import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatasetApiService {
  readonly APIUrl="https://localhost:7057/api";
  
  constructor(private http:HttpClient) { }
  
  // POST DATASET api/projects/{id}/dataset
  public postCSV(csvStr:String, project_id:number): Observable<HttpResponse<any>>{
    return this.http.post<any>(
      this.APIUrl + '/projects/' + project_id + '/dataset',
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
      this.APIUrl + '/projects/' + project_id + '/dataset',
      {
        observe: 'response'
      }
    )
  }
  
  
  
  
}
