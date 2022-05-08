import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JWTUtil } from 'src/app/_utilities/_helpers/jwt-util';
import { RedirectRoutes } from 'src/app/_utilities/_constants/routing.properties';
import { AuthService } from 'src/app/_utilities/_services/auth.service';
import { UserService } from 'src/app/_utilities/_services/user.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  userFullname: string = "";
  userImage: string = "assets/Images/profilna.png";


  constructor(
    private router: Router,
    public auth: AuthService,
    private userService: UserService,
    private appComp:AppComponent
  ) { }

  ngOnInit(): void {

    this.userFullname = this.auth.ime_prezime;

    this.userService.getImage(this.auth.korisnickoIme, this, this.loadUserImage);
  }

  private loadUserImage(self: any, image: string) {
    self.userImage = image;
  }

  logout() {
    this.auth.logout();
  }

  switchTheme() {
this.appComp.switchTheme();
  }

}
