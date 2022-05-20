import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket'
import { apiProperties } from '../_constants/api-properties';
import { JWTUtil } from '../_helpers/jwt-util';

@Injectable({
  providedIn: 'root'
})
export class TrainingApiService {

  url = apiProperties.wsurl;

  public train(projectId:number, nnId: number ,conf:any, self: any, callback: Function, completeCallback: Function){
    
    
    let url=this.url+'/api/projects/'+projectId+'/nn/'+nnId+'/train/start'
    
    let ws = webSocket<any>(
      {url: url},
      
    )

    ws.subscribe(
      {
        next: (val:any) => {
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
