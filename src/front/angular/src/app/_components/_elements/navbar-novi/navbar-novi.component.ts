import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RedirectRoutes } from 'src/app/_utilities/_constants/routing.properties';
import { JWTUtil } from 'src/app/_utilities/_helpers/jwt-util';
import { AuthService } from 'src/app/_utilities/_services/auth.service';

@Component({
  selector: 'app-navbar-novi',
  templateUrl: './navbar-novi.component.html',
  styleUrls: ['./navbar-novi.component.scss']
})
export class NavbarNoviComponent implements OnInit {

  constructor(private router:Router,public auth:AuthService) { }

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
