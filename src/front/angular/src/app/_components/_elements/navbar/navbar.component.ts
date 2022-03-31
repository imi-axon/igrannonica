import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JWTUtil } from 'src/app/_utilities/_helpers/jwt-util';
import { RedirectRoutes } from 'src/app/_utilities/_constants/routing.properties';
import { AuthService } from 'src/app/_utilities/_services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private router:Router,public auth:AuthService, public translate:TranslateService) { 

  }
  ngOnInit(): void {
  }
  
  logout()
  {
    JWTUtil.delete();
    this.router.navigate(RedirectRoutes.ON_LOGOUT);
    this.auth.logovan=false;
    this.auth.korisnickoIme='';
  }
 

}
