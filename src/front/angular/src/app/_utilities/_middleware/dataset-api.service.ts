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
  public AddDataset(datasetFile: FormData, project_id:number): Observable<HttpResponse<any>>{
    return this.http.post<any>(
      apiProperties.url + '/api/projects/' + project_id + '/dataset',
        datasetFile,
      { 
        observe: 'response',
        headers: HeaderUtil.jwtOnlyHeaders()
      }
    );
  }
  
  
  // GET DATASET api/projects/{id}/dataset
  public GetDataset(project_id: number, main: boolean): Observable<HttpResponse<any>>{
    return this.http.get<any>(
      apiProperties.url + '/api/projects/' + project_id + '/dataset/' + main,
      {
        observe: 'response',
        headers: HeaderUtil.jwtOnlyHeaders()
      }
    );
  }
  
  public GetDatasetPage(project_id: number, main: boolean, pageNumber: number, rowCount: number): Observable<HttpResponse<any>>{
    return this.http.get<any>(
      apiProperties.url + '/api/projects/' + project_id + '/dataset/' + main + "/page/" + pageNumber + "/rows/" + rowCount,
      {
        observe: 'response',
        headers: HeaderUtil.jwtOnlyHeaders()
      }
    );
  }
  
  
  public GetStatistics(project_id: number, main: boolean) : Observable<HttpResponse<any>>{
    return this.http.get<any>(
      apiProperties.url + '/api/projects/' + project_id + '/dataset/' + main + '/statistics',
      {
        observe: 'response',
        headers: HeaderUtil.jwtOnlyHeaders()
      }
    );
  }
  
  
  // EDIT
  public EditDataset(editJSON: any, project_id: number, main: boolean): Observable<HttpResponse<any>>{
    return this.http.put<any>(
      apiProperties.url + '/api/projects/' + project_id + '/dataset/' + main + '/edit',
      {
        actions: JSON.stringify(editJSON)
      },
      {
        observe: 'response',
        headers: HeaderUtil.jwtOnlyHeaders()
      }
    );
  }
  
  // SAVE Dataset
  // api/projects/{id}/dataset/save
  public SaveDataset(project_id: number): Observable<HttpResponse<any>>{
    return this.http.put<any>(
      apiProperties.url + "/api/projects/" + project_id + "/dataset/save", {},
      {
        observe: 'response',
        headers: HeaderUtil.jwtOnlyHeaders()
      }
    );
  }
  
  // GET File
  // api/projects/{id}/dataset/download
  public GetDatasetAsFile(project_id: number){
    return this.http.get(
      apiProperties.url + '/api/projects/' + project_id + '/dataset/download',
      {
        observe: 'response',
        responseType: 'blob',
        headers: HeaderUtil.jwtOnlyHeaders()
      }
    );
  }
  
  
}
