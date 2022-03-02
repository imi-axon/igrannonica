import { Injectable } from '@angular/core';
import { Uplata } from './uplata.model';

import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UplataService {

  constructor(private http:HttpClient) { }
  
  formData:Uplata = new Uplata();
  list:Uplata[];
  
  readonly baseURL = 'https://localhost:44327/api/Uplata';
  
  postUplata(){
    return this.http.post(this.baseURL, this.formData);
  }
  
  refreshList(){
    this.http.get(this.baseURL)
    .toPromise()
    .then(res => this.list = res as Uplata[]);
  }
  
  deleteUplata(id:number){
    return this.http.delete(`${this.baseURL}/${id}`);
  }
  
}
