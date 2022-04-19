import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket'
import { apiProperties } from '../_constants/api-properties';

@Injectable({
  providedIn: 'root'
})
export class TrainingApiService {

  url = apiProperties.wsurl;

  public train(projectId:number, nnId: number ,conf:any, cbObj: any, cbFun: Function){
    let url=this.url+'/api/projects/'+projectId+'/nn/'+nnId+'/train/start'
    let ws = webSocket<any>({url:url})

    ws.subscribe((val:any)=>{
      console.log("WS MESSAGE")
      console.log(val)

      if (cbObj && cbFun) {
        cbFun(cbObj, val)
      }

      ws.next('play');
    })

    ws.next(conf);
    ws.next('play');

  }

}
