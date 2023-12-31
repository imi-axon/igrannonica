import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RedirectRoutes } from 'src/app/_utilities/_constants/routing.properties';
import { JWTUtil } from 'src/app/_utilities/_helpers/jwt-util';
import { AuthService } from 'src/app/_utilities/_services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tel-nav',
  templateUrl: './tel-nav.component.html',
  styleUrls: ['./tel-nav.component.scss']
})
export class TelNavComponent implements OnInit {

  constructor(public auth:AuthService,private router:Router) { }

  ngOnInit(): void {
  }
  
  logout()
  {
   this.auth.logout();
  }
}
