import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CsvServiceService {
  readonly APIUrl="";

  constructor(private http:HttpClient) { }

  public prihvatiCsvString(csvStr:string)
  {
    if(csvStr=="") console.log("PRAZAN");
    else console.log(csvStr);
  }
}
