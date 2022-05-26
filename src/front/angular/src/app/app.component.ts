import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FullscreenLoaderComponent } from './_components/_elements/fullscreen-loader/fullscreen-loader.component';
import { JWTUtil } from './_utilities/_helpers/jwt-util';
import { AuthService } from './_utilities/_services/auth.service';
import { LanguageService } from './_utilities/_services/language.service';
import { LoaderService } from './_utilities/_services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  theme : Theme  = 'light_theme';
  title = 'angular';
  
  @ViewChild("fullscreenLoader")
  fullscreenLoader: FullscreenLoaderComponent;

  constructor(public translate:TranslateService, private router: Router, private languageService: LanguageService, private auth: AuthService, public loaderService:LoaderService)
  {
    translate.addLangs(['en','sr']);
    if(!localStorage.getItem('lang1')){
      localStorage.setItem('lang1','en');
      translate.defaultLang='en';
      languageService.language = localStorage.getItem('lang') || 'en';
      }
      else{
        translate.defaultLang=localStorage.getItem('lang1') || 'en';
      }
    
      // router.events.subscribe(
      //   (event) => {
      //     if(event instanceof RouteConfigLoadStart){
      //       this.fullscreenLoader.isLoading = true;
      //       console.log("LOAD START")
      //     }
      //     if(event instanceof RouteConfigLoadEnd){
      //       this.fullscreenLoader.isLoading = false;
      //       console.log("LOAD END")
      //     }
      //   }
      // )
  }
  
  
ngOnInit(){
  if(!localStorage.getItem('theme')) 
    localStorage.setItem('theme',this.theme);

  if(JWTUtil.get()!=''){
    if(this.auth.checkJWTexpired()) this.auth.tokenExpLogout();
    else this.auth.autoLogout();
  }


}
  
}

export type Theme ='light_theme' | 'dark_theme';


