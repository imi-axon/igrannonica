import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { regExp } from 'src/app/_utilities/_constants/regExp';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/_utilities/_services/login.service';
import { User } from 'src/app/_utilities/_data-types/models';
import { RedirectRoutes } from 'src/app/_utilities/_constants/routing.properties';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  public login:User = new User();
  
  constructor(
    private loginService:LoginService,
    private router:Router
  ) { }

   private pattUsername = regExp.pattUsername;
   private pattPass = regExp.pattPass;

  ngOnInit(): void {
  }

  public invalidUsername:boolean=true;
  public invalidPass:boolean=true;

  onSubmit(f:NgForm)
  {
    console.log(f.value);
    console.log(f.valid);

    if (!this.invalidUsername) {
      if(!this.invalidPass){
       console.log("tacno");
       //poslati back-u
       let loginUser=
       {
         username: f.value.username,
         password: f.value.pass //sifra se hashira serverside
       }
       this.loginService.loginUser(loginUser,this,this.handleSuccess,this.handleError);
       
      } 
      else { console.log("Lozinka nije pravilna");}
    }
    else {console.log("Username nije pravilan"); }
  }
  
  public checkUsername(){
    this.invalidUsername=false;
    if(!this.pattUsername.test(this.login.username)){
      this.invalidUsername = true;
      console.log("netacan username")
    }
  }

  public checkPass(){
    this.invalidPass=false;
    if(!this.pattPass.test(this.login.password)){
      this.invalidPass = true;
    }
  }

  handleSuccess(self: any) {
   // console.log("Tacno jeeeeeee");
    this.router.navigate(RedirectRoutes.ON_LOGIN);
    
  }

  handleError(self: any, message: string) {
    console.log("GRESKA")
    self.errorMessage = message;
    self.isSignUpFailed = true;
  }

}
