import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RedirectRoutes } from '../_constants/routing.properties';
import { JWTUtil } from '../_helpers/jwt-util';
import { PopupWindowComponent } from 'src/app/_components/_elements/popup-window/popup-window.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiProperties } from '../_constants/api-properties';
import { HeaderUtil } from '../_helpers/http-util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwt:string=JWTUtil.get();
  public logovan:boolean;
  public korisnickoIme:string='';
  public ime_prezime: string='';
  public exp: number;

  constructor( public router: Router, private dialog:MatDialog,private translate:TranslateService,private http: HttpClient) { 
    if(this.jwt=='') 
    {
      this.logovan=false;
      this.korisnickoIme='';
      this.ime_prezime='';
      this.exp=0;
    }
    else {
       this.logovan=true;
       this.korisnickoIme=JWTUtil.getUsername();
       this.ime_prezime=JWTUtil.getFullName();
       this.exp = JWTUtil.getExpDate();
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

  porukaPopup: String = "";
  openDialog(){
    //MORA OVAKO JER TRANLATE NE RADI 
    if(localStorage.getItem('lang1')=='en')
      this.porukaPopup = "Your session has expired. Please login again!";
    else if(localStorage.getItem('lang1')=='sr')
      this.porukaPopup = "Vaša sesija je istekla. Ulogujte se ponovo!";
    let dialogRef = this.dialog.open(PopupWindowComponent, { data: { poruka: this.porukaPopup } });
  }

  checkJWTexpired(){
      const exp = JWTUtil.getExpDate();
      return (Math.floor((new Date).getTime() / 1000)) >= exp;
  }

  private expDate:number
  private now:number

  autoLogout(){
    this.now=((new Date).getTime())/1000;
    this.expDate=JWTUtil.getExpDate();
    console.log(this.expDate);
    console.log(this.now);
    console.log(this.expDate-this.now);

    setTimeout(()=>{this.tokenExpLogout()},(this.expDate-this.now)*1000);
  }

  tokenExpLogout(){
    this.openDialog();
    this.logout();

  }
}
