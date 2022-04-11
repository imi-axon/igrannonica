import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket'
import { apiProperties } from '../_constants/api-properties';

@Injectable({
  providedIn: 'root'
})
export class TrainingApiService {

  url = apiProperties.wsurl;

  public train(projectId:number,conf:any){
    let url=this.url+'/api/projects/'+projectId+'/nn/1/train/start'
    let ws = webSocket<any>({url:url,deserializer:(msg)=>msg})

    ws.subscribe((val:any)=>{
      console.log("WS MESSAGE")
      console.log(val)
    })

    ws.next(conf);

  }

}
