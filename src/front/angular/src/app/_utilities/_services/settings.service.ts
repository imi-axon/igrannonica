import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor() { }
  
  /* LANGUAGE */
  public static language: string = "EN";
  public static enLanguageIcon: string = "assets/Images/en_lang.png";
  public static srLanguageIcon: string = "assets/Images/sr_lang.png";
  
  public static GetLanguageIconPath(){
    if(SettingsService.language == "SR")
      return SettingsService.srLanguageIcon;
    return SettingsService.enLanguageIcon;
  }
  public static ChangeLanguage(){
    if(SettingsService.language == "EN")
      SettingsService.language = "SR";
    else
      SettingsService.language = "EN";
  }
  /* END OF LANGUAGE */
  
  
  
  
  
  
  
}
