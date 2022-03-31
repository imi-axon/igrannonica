import { HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatasetApiService } from '../_middleware/dataset-api.service';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {
  
  constructor(private datasetAPI:DatasetApiService) { }
  
  AddDataset(csvData: any, project_id: number, self?: any, successCallback?: Function, badRequestCallback?: Function, unauthorizedCallback?: Function) {
    
    this.datasetAPI.AddDataset(csvData, project_id).subscribe(
      (response) => {
        
        if(response.status == HttpStatusCode.Ok)
          if(self && successCallback) 
            successCallback(self);
        
        if(response.status == HttpStatusCode.BadRequest)
          if(self && badRequestCallback)
            badRequestCallback(self, response.body.message);
        
        if(response.status == HttpStatusCode.Unauthorized)
          if(self && unauthorizedCallback)
            unauthorizedCallback(self, response.body.message);
      }
    );
  }
  
  GetDataset(project_id: number, main: boolean, self?: any, successCallback?: Function, unauthorizedCallback?: Function, forbiddenCallback?: Function, notFoundCallback?: Function){
    
    this.datasetAPI.GetDataset(project_id, main).subscribe(
      (response) => {
        
        if(response.status == HttpStatusCode.Ok)
          if(self && successCallback) 
            successCallback(self, response.body);
        
        if(response.status == HttpStatusCode.Unauthorized)
          if(self && unauthorizedCallback)
            unauthorizedCallback(self, response.body.message);
        
        if(response.status == HttpStatusCode.Forbidden)
          if(self && forbiddenCallback)
            forbiddenCallback(self, response.body.message);
        
        if(response.status == HttpStatusCode.NotFound)
          if(self && notFoundCallback)
            notFoundCallback(self, response.body.message);
      }
    );
  }
  
  GetStatistics(project_id: number, main: boolean, self?: any, successCallback?: Function, unauthorizedCallback?: Function, forbiddenCallback?: Function, notFoundCallback?: Function){
    
    this.datasetAPI.GetStatistics(project_id, main).subscribe(
      (response) => {
        
        if(response.status == HttpStatusCode.Ok)
          if(self && successCallback) 
            successCallback(self, response.body);
        
        if(response.status == HttpStatusCode.Unauthorized)
          if(self && unauthorizedCallback)
            unauthorizedCallback(self, response.body.message);
        
        if(response.status == HttpStatusCode.Forbidden)
          if(self && forbiddenCallback)
            forbiddenCallback(self, response.body.message);
        
        if(response.status == HttpStatusCode.NotFound)
          if(self && notFoundCallback)
            notFoundCallback(self, response.body.message);
      }
    )
  }
  
  EditDataset(editJSON: any, project_id: number, main: boolean, self?: any, successCallback?: Function, unauthorizedCallback?: Function, forbiddenCallback?: Function, notFoundCallback?: Function){
    this.datasetAPI.EditDataset(editJSON, project_id, main).subscribe(
      (response) => {
        
        if(response.status == HttpStatusCode.Ok)
          if(self && successCallback) 
            successCallback(self);
        
        if(response.status == HttpStatusCode.Unauthorized)
          if(self && unauthorizedCallback)
            unauthorizedCallback(self, response.body.message);
        
        if(response.status == HttpStatusCode.Forbidden)
          if(self && forbiddenCallback)
            forbiddenCallback(self, response.body.message);
        
        if(response.status == HttpStatusCode.NotFound)
          if(self && notFoundCallback)
            notFoundCallback(self, response.body.message);
      }
    )
  }
  
  
}
