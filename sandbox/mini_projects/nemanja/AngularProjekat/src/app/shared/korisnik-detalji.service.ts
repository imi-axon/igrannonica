import { Injectable } from '@angular/core';
import { KorisnikDetalji } from './korisnik-detalji.model';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class KorisnikDetaljiService {

  constructor(private http:HttpClient) { }

  readonly baseURL = 'https://localhost:44378/api/KorisnikDetalji'
  formData:KorisnikDetalji = new KorisnikDetalji();
  list: KorisnikDetalji[];

  postKorisnikDetalji(){
    return this.http.post(this.baseURL, this.formData);
  }

  putKorisnikDetalji(){
    return this.http.put(`${this.baseURL}/${this.formData.iDkorisnika}`, this.formData);
  }

  deleteKorisnikDetalji(id:number){
    return this.http.delete(`${this.baseURL}/${id}`);
  }
  refreshlist()
  {
    this.http.get(this.baseURL).toPromise().then(res => this.list = res as KorisnikDetalji[])
  }
}
