import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataSetTableService {
  readonly APIUrl="https://localhost:7057/api";
  
  constructor(private http:HttpClient) { }
  
  response : any;
  
  public GetDataSet(){
    // Primer JSON fajl-a koji dobijamo sa backend-a
    // Kasnije menjamo sa http request-om
    /*this.getDataJSON = [
      {"id":1,"name":"albert einstein","year of birth":1879,"address":"ulica1", "testKolona1":"test", "testKolona2":"test"},
      {"id":2,"name":"isaac newton","year of birth":1643,"address":"ulica2", "testKolona1":"test", "testKolona2":"test"},
      {"id":3,"name":"marie curie","year of birth":1867,"address":"ulica3", "testKolona1":"test", "testKolona2":"test"},
      {"id":4,"name":"galilée","year of birth":1564,"address":"ulica4", "testKolona1":"test", "testKolona2":"test"},
      {"id":5,"name":"janacko kars","year of birth":1752,"address":"ulica5", "testKolona1":"test", "testKolona2":"test"},
      {"id":6,"name":"peter p pete","year of birth":1502,"address":"ulica5", "testKolona1":"test", "testKolona2":"test"},
      {"id":7,"name":"john smith","year of birth":1862,"address":"ulica5", "testKolona1":"test", "testKolona2":"test"},
      {"id":8,"name":"mark oblicue","year of birth":1905,"address":"ulica5", "testKolona1":"test", "testKolona2":"test"},
      {"id":9,"name":"shaun","year of birth":1675,"address":"ulica5", "testKolona1":"test", "testKolona2":"test"}
    ];*/
    
    //return this.http.get(/*, {responseType: 'text'}*/);
    
    
    
  }
  
  
}
