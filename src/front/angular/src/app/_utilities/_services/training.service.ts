import { HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TrainingApiService } from '../_middleware/training-api.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  constructor(private trainingApi:TrainingApiService) { }

  public stopTrain(projectId:number, nnId: number , self: any, successCallback: Function){
    this.trainingApi.stopTrain(projectId,nnId).subscribe(

      (response: any) => {

        if(response.status == HttpStatusCode.Ok)
          if(self && successCallback) 
            successCallback(self);
        
        if(response.status == HttpStatusCode.Unauthorized)
            console.log("UNAUTHORIZED");
        //   if(self && badRequestCallback)
        //     badRequestCallback(self,response.body.message);
        if(response.status==HttpStatusCode.Forbidden)
          console.log("FORBIDDEN");
        
      }
    );
  

  }

  public isTraining(projectId:number, nnId: number , self: any, successCallback: Function){
    this.trainingApi.isTraining(projectId,nnId).subscribe(

      (response: any) => {

        if(response.status == HttpStatusCode.Ok)
          if(self && successCallback) 
            successCallback(self, response.body);
        
        if(response.status == HttpStatusCode.Unauthorized)
            console.log("UNAUTHORIZED");

        if(response.status==HttpStatusCode.Forbidden)
          console.log("FORBIDDEN");
        
      }
    );

  }
}
