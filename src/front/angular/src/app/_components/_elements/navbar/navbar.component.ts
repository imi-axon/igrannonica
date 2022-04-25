import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JWTUtil } from 'src/app/_utilities/_helpers/jwt-util';
import { RedirectRoutes } from 'src/app/_utilities/_constants/routing.properties';
import { AuthService } from 'src/app/_utilities/_services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/_utilities/_services/user.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  languageIcon = "";
  language: string;
  
  userFullname: string = "";
  userImage: string = "assets/Images/profilna.png";
  srImage: string = "assets/Images/Icons/sr_lang.png";
  enImage: string = "assets/Images/Icons/en_lang.png";
  
  constructor(
    private router: Router,
    private auth: AuthService,
    private translate: TranslateService,
    private userService: UserService
  ) { }
    
  ngOnInit(): void {
    this.language = localStorage.getItem('lang1') || 'en';
    this.translate.use(this.language);
    
    if(this.language == "en")
      this.languageIcon = this.enImage;
    else
      this.languageIcon = this.srImage;
    
    this.userFullname = this.auth.ime_prezime;
    
    this.userService.getImage(this.auth.korisnickoIme, this, this.loadUserImage);
  }
  
  private loadUserImage(self: any, image: string){
    self.userImage = image;
    console.log("SLIKA")
    console.log(image)
  }
  
  logout()
  {
    JWTUtil.delete();
    this.router.navigate(RedirectRoutes.ON_LOGOUT);
    this.auth.logovan=false;
    this.auth.korisnickoIme='';
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

}
