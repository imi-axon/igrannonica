import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiProperties } from '../_constants/api-properties';
import { NN } from '../_data-types/models';
import { HeaderUtil } from '../_helpers/http-util';

@Injectable({
  providedIn: 'root'
})
export class NnApiService {

  constructor(private http:HttpClient) { }

  private url: string = apiProperties.url +'/api/projects/';

  projectsNN(projectID:number):Observable<HttpResponse<NN[]>>{
    let response = this.http.get<NN[]>(
      this.url + projectID + '/nn',
      {
        observe:"response",
        headers:HeaderUtil.jwtOnlyHeaders()
      }
    );
    return response;
  }
  
  
  deleteProject(projectId: number, networkId: number){
    let response = this.http.delete( 
      this.url + projectId + "/nn/" + networkId,
      {
        observe: "response",
        headers: HeaderUtil.jwtOnlyHeaders()
      }
    );
    return response;
  }
  
  changeNNTitle(projectId: number, networkId: number, newTitle: string){
    return this.http.put(
      this.url + projectId + "/edittitle/" + networkId,
      {
        title: newTitle
      },
      {
        observe: 'response',
        headers: HeaderUtil.jwtOnlyHeaders()
      }
    )
  }
  
  getTrainRez(projectId: number, networkId: number){
    return this.http.get(
      apiProperties.url + "/api/files/Storage/proj" + projectId + "/mreze/trainrez" + networkId + '.txt',
      {
        observe: 'response',
        headers: HeaderUtil.jwtOnlyHeaders()
      }
    )
  }
  
}
