import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RedirectRoutes } from 'src/app/_utilities/_constants/routing.properties';
import { JWTUtil } from 'src/app/_utilities/_helpers/jwt-util';
import { AuthService } from 'src/app/_utilities/_services/auth.service';
import { LanguageComponent } from '../language/language.component';
import { TelNavComponent } from '../tel-nav/tel-nav.component';

@Component({
  selector: 'app-landing-nav',
  templateUrl: './landing-nav.component.html',
  styleUrls: ['./landing-nav.component.scss']
})
export class LandingNavComponent implements OnInit {

  constructor(private router:Router,public auth:AuthService, public translate:TranslateService) { 
  }
  ngOnInit(): void {
  }
  
  logout()
  {
   this.auth.logout();
  }

}
