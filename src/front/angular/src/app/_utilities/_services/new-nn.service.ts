import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewNnApiService } from '../_middleware/new-nn-api.service';

@Injectable({
  providedIn: 'root'
})
export class NewNnService {

  constructor(private newNNapi:NewNnApiService) { }

  public newNN(nnData: any,id:number, self?: any, successCallback?: Function, errorCallback?: Function){
    this.newNNapi.newNN(nnData,id).subscribe(
      (response:HttpResponse<any>) => {
   
        // OK (Success)
          if(response.status== HttpStatusCode.Ok){
             if(self && successCallback) 
                successCallback(self,response.body);
          }
          
        // Unauthorized
          if(response.status == HttpStatusCode.Unauthorized){
            if(self && errorCallback){
              errorCallback(self, response.body.message);  
        }}
         // Forbidden
         if(response.status == HttpStatusCode.Forbidden){
          if(self && errorCallback){
            errorCallback(self, response.body.message);  
      }}
      }
    );
    

  }
}
