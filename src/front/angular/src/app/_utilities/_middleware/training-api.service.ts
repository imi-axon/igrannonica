import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket'
import { apiProperties } from '../_constants/api-properties';

@Injectable({
  providedIn: 'root'
})
export class TrainingApiService {

  url = apiProperties.wsurl;

  public train(projectId:number, nnId: number ,conf:any, self: any, callback: Function){
    
    
    let url=this.url+'/api/projects/'+projectId+'/nn/'+nnId+'/train/start'
    
    let ws = webSocket<any>(
      {url: url},
      
    )

    ws.subscribe((val:any)=>{
      console.log("WS MESSAGE")
      console.log(val)

      if (self && callback)
        callback(self, val)
      

      //ws.next('play');
    })

    ws.next(conf);
    //ws.next('play');

  }

}
