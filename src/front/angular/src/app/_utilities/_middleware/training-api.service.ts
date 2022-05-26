import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket'
import { apiProperties } from '../_constants/api-properties';
import { JWTUtil } from '../_helpers/jwt-util';
import { LoaderService } from '../_services/loader.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingApiService {
  constructor(private loaderService:LoaderService){}

  url = apiProperties.wsurl;

  public train(projectId:number, nnId: number ,conf:any, self: any, callback: Function, completeCallback: Function){
    
    
    let url=this.url+'/api/projects/'+projectId+'/nn/'+nnId+'/train/start'
    this.loaderService.isLoading.next(true);
    
    let ws = webSocket<any>(
      {url: url},
      
    )

    ws.subscribe(
      {
        next: (val:any) => {
          this.loaderService.isLoading.next(false);
          console.log("WS MESSAGE")
          console.log(val)

          if (self && callback)
            callback(self, val)
        },
        error: (err: any) => {
          console.log('> >>> >> > > ERROR WS')
          completeCallback(self);
        },
        complete: () => {
          console.log('> >>> >> > > KRAJ WS')
        }
      }
    )
    
    console.log(JWTUtil.get())
    ws.next(JWTUtil.get());
    ws.next(conf);

  }

}
