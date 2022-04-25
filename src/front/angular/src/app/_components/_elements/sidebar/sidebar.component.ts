import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RedirectRoutes } from 'src/app/_utilities/_constants/routing.properties';
import { JWTUtil } from 'src/app/_utilities/_helpers/jwt-util';
import { AuthService } from 'src/app/_utilities/_services/auth.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  
  Logout()
  {
    JWTUtil.delete();
    this.router.navigate(RedirectRoutes.ON_LOGOUT);
    this.authService.logovan=false;
    this.authService.korisnickoIme='';
  }

}
