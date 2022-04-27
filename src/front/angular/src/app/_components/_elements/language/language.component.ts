import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {

  constructor(  
    private translate: TranslateService) { }
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
