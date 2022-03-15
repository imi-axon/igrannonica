import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { regExp } from 'src/app/_utilities/_constants/regExp';
import { Router } from '@angular/router';
import { User } from 'src/app/_utilities/_api/_data-types/models';
import { sha512 } from 'js-sha512';
import { LoginService } from 'src/app/_utilities/_services/login.service';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  public loginUser:User = new User();

  constructor(
    private loginService:LoginService,
    private router:Router
  ) { }

   private pattUsername = regExp.pattUsername;
   private pattPass = regExp.pattPass;

  ngOnInit(): void {
  }

  public invalidUsername:boolean;
  public invalidPass:boolean;


  onSubmit(f:NgForm)
  {
    console.log(f.value);
    console.log(f.valid);


    this.invalidUsername=false;
    this.invalidPass=false;

    if (this.pattUsername.test(f.value.username)) {
      if(this.pattPass.test(f.value.pass)){
       console.log("tacno");
       //poslati back-u
       let loginUser=
       {
         username: f.value.username,
         password: f.value.pass //sifra se hashira serverside
       }
    
       this.loginService.loginUser(loginUser,this,this.handleSuccess,this.handleError);
       
      } 
      else { console.log("Lozinka nije pravilna"); this.invalidPass=true;}
    }
    else {console.log("Username nije pravilan"); this.invalidUsername=true}
  }
  

  handleSuccess(self: any) {
    console.log("Tacno");
    
  }

  handleError(self: any, message: string) {
    self.errorMessage = message;
    self.isSignUpFailed = true;
  }

}
