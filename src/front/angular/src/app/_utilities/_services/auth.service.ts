import { Injectable } from '@angular/core';
import { JWTUtil } from '../_helpers/jwt-util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwt:string=JWTUtil.get();
  public logovan:boolean;

  constructor() { 
    if(this.jwt=='') this.logovan=false;
    else this.logovan=true;
  }
}
