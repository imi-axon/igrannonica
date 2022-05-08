import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2, ViewChild } from '@angular/core';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FullscreenLoaderComponent } from './_components/_elements/fullscreen-loader/fullscreen-loader.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  theme : Theme  = 'light_theme';
  title = 'angular';
  
  @ViewChild("fullscreenLoader")
  fullscreenLoader: FullscreenLoaderComponent;

  constructor(public translate:TranslateService, private router: Router, @Inject(DOCUMENT) private document: Document, private renderer:Renderer2)
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
    this.initializeTheme();
  }
  initializeTheme =():void=>this.renderer.addClass(this.document.body, this.theme);
  
  switchTheme(){
    console.log("menjam " + this.theme);
    this.document.body.classList.replace(this.theme, this.theme==='light_theme'?(this.theme='dark_theme'):(this.theme='light_theme'))
    console.log("promenjeno " + this.theme);
  }
  
}

export type Theme ='light_theme' | 'dark_theme';
