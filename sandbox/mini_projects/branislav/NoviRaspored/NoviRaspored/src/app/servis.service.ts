import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Zadatak } from './ZadModel';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root'
})
export class ServisService {



  private apiUrl="https://localhost:44328/api/Zadataks"
  //testni:Zadatak[]=[{dan:"Cetvrtak",naziv:"Cetvrti",opis:"Opis 4",vreme:"20:20"}];
  zadaci:Zadatak[]=[];

  constructor(private http:HttpClient) { }

  uzmiZadatke():Observable<Zadatak[]> {
    return this.http.get<Zadatak[]>(this.apiUrl);
  }

  obrisiZadatak(zadatak:Zadatak):Observable<Zadatak>{
    const url=`${this.apiUrl}/${zadatak.zadId}`;
    return this.http.delete<Zadatak>(url);
  }
  dodajZadatak(zadatak:Zadatak):Observable<Zadatak>{
    return this.http.post<Zadatak>(this.apiUrl,zadatak,httpOptions)
  }

  nam8(zadatak:Zadatak):Observable<Zadatak>{
    const url=`${this.apiUrl}/${zadatak.zadId}`;
    zadatak.vreme="08:00";
    return this.http.put<Zadatak>(url,zadatak,httpOptions);
  }
}
