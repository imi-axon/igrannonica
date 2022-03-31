import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { regExp } from 'src/app/_utilities/_constants/regExp';
import { RedirectRoutes } from 'src/app/_utilities/_constants/routing.properties';
import { RegistrationCheck, UserRegistration } from 'src/app/_utilities/_data-types/models';
import { UserService } from 'src/app/_utilities/_services/user.service';

@Component({
  selector: 'registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {
  public registration:UserRegistration = new UserRegistration();
  public passwordAgain:string = "";
  
  public registrationCheck:RegistrationCheck = new RegistrationCheck();
  
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  
  constructor(private userService: UserService,public translate:TranslateService) { }
  
  

  ngOnInit(): void {
  }
  
  public SubmitRegistracija(){
    if(this.registrationCheck.invalidRegistration)
      return;
    
    this.userService.Register(this.registration, this, this.handleSuccess, this.handleUsedUsername, this.handleLogedIn);
    
  }
  
  handleSuccess(self: any) {
    self.router.navigate(RedirectRoutes.ON_REGISTER_SUCCESSFUL);
  }

  handleUsedUsername(self: any, message: string) {
    self.errorMessage = message;
    self.isSignUpFailed = true;
  }
  
  handleLogedIn(self: any, message: string){
    
  }
  
  
  // Validacije
  
  public checkName(){
    this.registrationCheck.invalidName = false;
    
    if(!regExp.pattName.test(this.registration.firstname))
      this.registrationCheck.invalidName = true;
    
    this.registrationCheck.checkForm();
  }
  
  public checkLastname(){
    this.registrationCheck.invalidLastname = false;
    
    if(!regExp.pattName.test(this.registration.lastname))
      this.registrationCheck.invalidLastname = true;
      
    this.registrationCheck.checkForm();
  }
  
  public checkUsername(){
    this.registrationCheck.invalidUsername = false;
    
    if(!regExp.pattUsername.test(this.registration.username))
      this.registrationCheck.invalidUsername = true;
      
    this.registrationCheck.checkForm();
  }
  
  public checkEmail(){
    this.registrationCheck.invalidEmail = false;
    
    if(!regExp.pattEmail.test(this.registration.email))
      this.registrationCheck.invalidEmail = true;
      
    this.registrationCheck.checkForm();
  }
  
  public checkPassword(){
    this.registrationCheck.invalidPassword = false;
    
    if(!regExp.pattPass.test(this.registration.password))
      this.registrationCheck.invalidPassword = true;
      
    this.checkPasswordAgain();
    this.registrationCheck.checkForm();
  }
  
  public checkPasswordAgain(){
    this.registrationCheck.invalidPasswordAgain = false;
    
    if(this.passwordAgain != this.registration.password || this.passwordAgain.length == 0)
      this.registrationCheck.invalidPasswordAgain = true;
      
    this.registrationCheck.checkForm();
  }
  
}