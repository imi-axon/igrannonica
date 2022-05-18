import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FullscreenLoaderComponent } from './_components/_elements/fullscreen-loader/fullscreen-loader.component';
import { LanguageService } from './_utilities/_services/language.service';

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

  constructor(public translate:TranslateService, private router: Router, private languageService: LanguageService)
  {
    translate.addLangs(['en','sr']);
    if(!localStorage.getItem('lang1')){
      localStorage.setItem('lang1','en');
      languageService.language = localStorage.getItem('lang') || 'en';
      }
    
      router.events.subscribe(
        (event) => {
          if(event instanceof RouteConfigLoadStart){
            this.fullscreenLoader.isLoading = true;
            console.log("LOAD START")
          }
          if(event instanceof RouteConfigLoadEnd){
            this.fullscreenLoader.isLoading = false;
            console.log("LOAD END")
          }
        }
      )
  }
  
  
ngOnInit(){
  if(!localStorage.getItem('theme')) 
    localStorage.setItem('theme',this.theme);
}
  
}

export type Theme ='light_theme' | 'dark_theme';


