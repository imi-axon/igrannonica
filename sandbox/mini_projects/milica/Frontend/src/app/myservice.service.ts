import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class MyserviceService {

  constructor(private http: HttpClient) { }

  sendUser(name:string, email:string) {
    let header: HttpHeaders = new HttpHeaders ({
        'Content-type':'application/json',
    });

    return this.http.post('http://localhost:5000/api/kontroler/', {name, email},{headers: header, responseType:'text'}); 
  }
}
