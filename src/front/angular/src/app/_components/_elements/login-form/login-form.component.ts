import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { regExp } from 'src/app/_utilities/_constants/regExp';
import { Router } from '@angular/router';
import { UserService } from 'src/app/_utilities/_services/user.service';
import { UserLogin } from 'src/app/_utilities/_data-types/models';
import { RedirectRoutes } from 'src/app/_utilities/_constants/routing.properties';
import { AuthService } from 'src/app/_utilities/_services/auth.service';
import { JWTUtil } from 'src/app/_utilities/_helpers/jwt-util';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  
  public isSignUpFailed: boolean = false;
  
  public login:UserLogin = new UserLogin();
  public loginUser: UserLogin = new UserLogin();
  
  public loginFailed: boolean = false;
  
  constructor(
    private userService:UserService,
    private router:Router,
    private authService:AuthService
  ) { }

   private pattUsername = regExp.pattUsername;
   private pattPass = regExp.pattPass;

  ngOnInit(): void {
  }

  public invalidUsername:boolean=false;
  public invalidPass:boolean=false;

  onSubmit(f:NgForm)
  {

    if (!this.invalidUsername) {
      if(!this.invalidPass){
       console.log("tacno");
       //poslati back-u
       this.loginUser.username=f.value.username;
       this.loginUser.password=f.value.pass;
       console.log(this.loginUser);
       this.userService.loginUser(this.loginUser,this,this.handleSuccess,this.handleError);
       
      } 
      else { console.log("Lozinka nije pravilna");}
    }
    else {console.log("Username nije pravilan"); }
  }
  
  public checkUsername(){
    this.isSignUpFailed = false;
    this.invalidUsername=false;
    if(!this.pattUsername.test(this.login.username)){
      this.invalidUsername = true;
      console.log("netacan username")
    }
  }

  public checkPass(){
    this.isSignUpFailed = false;
    this.invalidPass=false;
    if(!this.pattPass.test(this.login.password)){
      this.invalidPass = true;
    }
  }

  handleSuccess(self: any) {
    //console.log("Tacno jeeeeeee");
    self.authService.logovan=true;
    self.authService.autoLogout();
    self.authService.korisnickoIme=JWTUtil.getUsername();
    self.authService.ime_prezime=JWTUtil.getFullName();
    self.router.navigate(RedirectRoutes.ON_LOGIN); //SELF, NE THIS
 
  }

  handleError(self: any, message: string) {
    console.log("TESTTESTTEST")
    self.isSignUpFailed = true;
  }

}
