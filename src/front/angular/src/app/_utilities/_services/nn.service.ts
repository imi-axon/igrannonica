import { HttpStatusCode } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { NN } from '../_data-types/models';
import { NnApiService } from '../_middleware/nn-api.service';

@Injectable({
  providedIn: 'root'
})
export class NnService {

  constructor(private nnApiService:NnApiService) { }
  @Input() public mreze: NN[] = [];

  projectsNN(projectID:number,self:any, successCallback?:Function, errorCallback?: Function){
    this.nnApiService.projectsNN(projectID).subscribe(
      (response) => {
        if (response.status== HttpStatusCode.Ok) { 
        //  console.log("TACNO");
         this.mreze=(response.body==null)?[]:response.body;
          console.log(this.mreze);
          if(response.body)
            if (self && successCallback) successCallback(self,this.mreze);

        }
        if(response.status==HttpStatusCode.NotFound)
        {
          console.log("NETACNO");
          if (self && errorCallback) errorCallback(self, response.status);
        }
      }
    );
  }
}
