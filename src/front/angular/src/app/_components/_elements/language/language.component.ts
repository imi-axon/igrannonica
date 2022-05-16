import { Component, OnInit, ViewChild, ViewRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/_utilities/_services/language.service';
import { LandingPageSelectorComponent } from '../landing-page-selector/landing-page-selector.component';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {


  constructor( public translate: TranslateService, public languageService: LanguageService ) { }
  public language: string;
  
  ngOnInit(): void {
    this.language = localStorage.getItem('lang1') || 'en';
    this.languageService.language=this.language;
    this.translate.use(this.language);
  }

  public ChangeLanguage(lang:string){
    this.translate.use(lang);
    localStorage.setItem('lang1', lang);
    this.language=lang;
    this.languageService.language=this.language;
  }

}
