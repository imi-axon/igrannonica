import { HttpErrorResponse, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { NN } from '../_data-types/models';
import { NnApiService } from '../_middleware/nn-api.service';

@Injectable({
  providedIn: 'root'
})
export class NnService {

  constructor(private nnApiService:NnApiService) { }

  projectsNN(projectID:number,self:any, successCallback?: Function, unauthorizedCallback?: Function, notFoundCallback?: Function, badRequestCallback?: Function){
    this.nnApiService.projectsNN(projectID).subscribe(
      {
        next: function(response: HttpResponse<any>) {
        
          if (response.status == HttpStatusCode.Ok)
            if(self && successCallback)
              successCallback(self, (response.body==null)?[]:response.body);
            
        },
        
        error: function(response: HttpErrorResponse){
          
          if (response.status == HttpStatusCode.NotFound)
            if (self && notFoundCallback){
              notFoundCallback(self);
            }
          
          if(response.status==HttpStatusCode.Unauthorized)
            if(self && unauthorizedCallback)
              unauthorizedCallback(self, response);
          
          if(response.status==HttpStatusCode.BadRequest)
            if(self && badRequestCallback)
              badRequestCallback(self, response);
        }
        
      });
  }
  
  deleteNN(projectId: number, networkId: number, self: any, successCallback?: Function, unauthorizedCallback?: Function, notFoundCallback?: Function, badRequestCallback?: Function){
    this.nnApiService.deleteProject(projectId, networkId).subscribe(
      {
        next: function(response: HttpResponse<any>) {
          if (self && successCallback)
            successCallback(self);
          },
          
          error: function(response: HttpResponse<any>){
            
            if (response.status == HttpStatusCode.Unauthorized)
              if (self && unauthorizedCallback)
                unauthorizedCallback(self, response.body.message);

            if (response.status == HttpStatusCode.NotFound)
              if (self && notFoundCallback)
                notFoundCallback(self, response.body.message);
                
            if (response.status == HttpStatusCode.BadRequest)
              if (self && badRequestCallback)
                badRequestCallback(self, response.body.message);
                
          }
      }
    )
  }
  
}
