import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CsvServiceService {
  readonly APIUrl="https://localhost:7057/api";

  constructor(private http:HttpClient) { }

  // private handleError(error: HttpErrorResponse) {
  //   if (error.status === 0) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error('An error occurred:', error.error);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong.
  //     console.error(
  //       `Backend returned code ${error.status}, body was: `, error.error);
  //   }
  //   // Return an observable with a user-facing error message.
  //   return throwError(() => new Error('Something bad happened; please try again later.'));
  // }


  public prihvatiCsvString(csvStr:String)  {
   console.log("Saljem string .NET-u");
   console.log(typeof(csvStr));
   console.log(csvStr);
   csvStr=csvStr.split('\r').join(' ').split('\n').join(' ');
   console.log(csvStr);
   return this.http.post(this.APIUrl+'/CSVstring', {csvstring:csvStr});
   //{csvstring:csvStr})
    
  }
}
