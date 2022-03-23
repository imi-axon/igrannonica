import { Injectable } from '@angular/core';
import { JWTUtil } from '../_helpers/jwt-util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwt:string=JWTUtil.get();
  public logovan:boolean;
  public korisnickoIme:string='';

  constructor() { 
    if(this.jwt=='') 
    {
      this.logovan=false;
      this.korisnickoIme='';
    }
    else {
       this.logovan=true;
       this.korisnickoIme=JWTUtil.getUsername();
    }
  }
}
