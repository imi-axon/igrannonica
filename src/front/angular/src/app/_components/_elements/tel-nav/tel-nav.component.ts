import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RedirectRoutes } from 'src/app/_utilities/_constants/routing.properties';
import { JWTUtil } from 'src/app/_utilities/_helpers/jwt-util';
import { AuthService } from 'src/app/_utilities/_services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tel-nav',
  templateUrl: './tel-nav.component.html',
  styleUrls: ['./tel-nav.component.scss']
})
export class TelNavComponent implements OnInit {

  constructor(public auth:AuthService,private router:Router, private translate: TranslateService,) { }
  languageIcon = "";
  language: string;
  srImage: string = "assets/Images/Icons/sr_lang.png";
  enImage: string = "assets/Images/Icons/en_lang.png";

  ngOnInit(): void {
    this.language = localStorage.getItem('lang1') || 'en';
    this.translate.use(this.language);
    
    if(this.language == "en")
      this.languageIcon = this.enImage;
    else
      this.languageIcon = this.srImage;
    
    // this.userFullname = this.auth.ime_prezime;
    
    // this.userService.getImage(this.auth.korisnickoIme, this, this.loadUserImage);
  }

  public ChangeLanguage(){
    if(this.language == "en"){
      this.languageIcon = this.srImage;
      this.language = "sr";
    }
    else{
      this.languageIcon = this.enImage;
      this.language = "en";
    }
    
    this.translate.use(this.language);
    localStorage.setItem('lang1', this.language);
  }
  logout()
  {
    JWTUtil.delete();
    this.router.navigate(RedirectRoutes.ON_LOGOUT);
    this.auth.logovan=false;
    this.auth.korisnickoIme='';
  }
}
