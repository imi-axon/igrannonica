import { HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NetworkApiService } from '../_middleware/network-api.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor(private networkApi: NetworkApiService) { }
  
  
  public GetNetwork(projectID: number, networkID: number, successCallback?: Function, unauthorizedCallback?: Function, forbiddenCallback?: Function){
    
    this.networkApi.GetNetwork(projectID, networkID).subscribe(
      
      (response) => {
        
        if (response.status == HttpStatusCode.Ok)
          if (self && successCallback)
            successCallback(self, response.body);

        if (response.status == HttpStatusCode.Unauthorized)
          if (self && unauthorizedCallback)
            unauthorizedCallback(self, response.body.message);

        if (response.status == HttpStatusCode.Forbidden)
          if (self && forbiddenCallback)
            forbiddenCallback(self, response.body.message);
        
      }
    
    );
  }
  
}
