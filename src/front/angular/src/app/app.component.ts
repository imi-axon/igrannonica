import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FullscreenLoaderComponent } from './_components/_elements/fullscreen-loader/fullscreen-loader.component';

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

  constructor(public translate:TranslateService, private router: Router)
  {
    translate.addLangs(['en','sr']);
    translate.setDefaultLang('en');
    
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


