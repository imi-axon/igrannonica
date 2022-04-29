import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RedirectRoutes } from '../_constants/routing.properties';
import { JWTUtil } from '../_helpers/jwt-util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwt:string=JWTUtil.get();
  public logovan:boolean;
  public korisnickoIme:string='';
  public ime_prezime: string='';

  constructor( public router: Router) { 
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

  public logout()
  {
    JWTUtil.delete();
    this.router.navigate(RedirectRoutes.ON_LOGOUT);
    this.logovan=false;
    this.korisnickoIme='';
    this.ime_prezime='';
  }
}
