import { Injectable } from '@angular/core';
import { DatasetApiService } from '../_middleware/dataset-api.service';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {
  
  constructor(private datasetAPI:DatasetApiService) { }
  
  // Unesi novi CSV fajl za odredjeni projekat sa id-em 'project_id'
  addCSV(csvData: any, project_id: number, self?: any, successCallback?: Function, badRequestCallback?: Function, unauthorizedCallback?: Function) {
    
    this.datasetAPI.postCSV(csvData, project_id).subscribe(
      (response) => {
        // OK (Success)
        if(response.status == 200)
          if(self && successCallback) 
            successCallback(self);
        
        // Bad Request
        if(response.status == 400)
          if(self && badRequestCallback)
            badRequestCallback(self, response.body.message);
        
        // Unauthorized
        if(response.status == 401)
          if(self && unauthorizedCallback)
            unauthorizedCallback(self, response.body.message);
      }
    );
  }
  
  // Preuzmi CSV odredjenog projekta sa id-em 'project_id'
  getCSV(project_id: number, self?: any, successCallback?: Function, notFoundCallback?: Function, unauthorizedCallback?: Function){
    
    this.datasetAPI.getCSV(project_id).subscribe(
      (response) => {
        // OK (Success)
        if(response.status == 200)
          if(self && successCallback) 
            successCallback(self, response.body);
        
        // Not Found
        if(response.status == 404)
          if(self && notFoundCallback)
            notFoundCallback(self, response.body.message);
        
        // Unauthorized
        if(response.status == 401)
          if(self && unauthorizedCallback)
            unauthorizedCallback(self, response.body.message);
      }
    );
  }
  
}
