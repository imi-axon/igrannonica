import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CsvServiceService {
  readonly APIUrl="https://localhost:7057/api";

  constructor(private http:HttpClient) { }

  public prihvatiCsvString(csvStr:string)
  {
    if(csvStr=="") {console.log("PRAZAN");return;}
   // else console.log(csvStr);
   else {console.log("Saljem string .NET-u");return this.http.post(this.APIUrl+'/CSVstring', csvStr);}
    
  }
}
