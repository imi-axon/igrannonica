import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket'

@Injectable({
  providedIn: 'root'
})
export class TrainingApiService {

  public test(proj: number, conf: any)
  {
    let ws = webSocket<any>({ url: "wss://localhost:7057/api/projects/"+proj+"/nn/1/train/start", deserializer: (msg) => msg })
    ws.subscribe((val: any) => {
      console.log("WS MESSAGE:")
      console.log(val)
    })

    ws.next(conf)

  }

}
