import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiProperties } from '../_constants/api-properties';
import { HeaderUtil } from '../_helpers/http-util';

@Injectable({
  providedIn: 'root'
})
export class DatasetApiService {
  
  constructor(private http:HttpClient) { }
  
  // POST DATASET api/projects/{id}/dataset
  public AddDataset(csvStr:String, project_id:number): Observable<HttpResponse<any>>{
    return this.http.post<any>(
      apiProperties.url + '/api/projects/' + project_id + '/dataset',
      { 
        dataset:csvStr 
      },
      { 
        observe: 'response',
        headers: HeaderUtil.jwtOnlyHeaders()
      }
    );
  }
  
  
  // GET DATASET api/projects/{id}/dataset
  public GetDataset(project_id:number): Observable<HttpResponse<any>>{
    return this.http.get<any>(
      apiProperties.url + '/api/projects/' + project_id + '/dataset',
      {
        observe: 'response',
        headers: HeaderUtil.jwtOnlyHeaders()
      }
    );
  }
  
  
  public GetStatistics(project_id: number, main: boolean){
    return this.http.get<any>(
      apiProperties.url + '/api/projects/' + project_id + '/dataset/' + main + '/statistics',
      {
        observe: 'response',
        headers: HeaderUtil.jwtOnlyHeaders()
      }
    );
  }
  
  
  
}
