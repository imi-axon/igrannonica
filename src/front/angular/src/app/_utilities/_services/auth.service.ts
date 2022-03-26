import { Injectable } from '@angular/core';
import { JWTUtil } from '../_helpers/jwt-util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwt:string=JWTUtil.get();
  public logovan:boolean;
  public korisnickoIme:string='';
  public ime_prezime: string='';

  constructor() { 
    if(this.jwt=='') 
    {
      this.logovan=false;
      this.korisnickoIme='';
      this.ime_prezime='';
    }
    else {
       this.logovan=true;
       this.korisnickoIme=JWTUtil.getUsername();
       this.ime_prezime=JWTUtil.getFullName();
    }
  }
}
