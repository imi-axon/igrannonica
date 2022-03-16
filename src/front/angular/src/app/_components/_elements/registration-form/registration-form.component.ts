import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { regExp } from 'src/app/_utilities/_constants/regExp';
import { RedirectRoutes } from 'src/app/_utilities/_constants/routing.properties';
import { User } from 'src/app/_utilities/_data-types/models';
import { RegistrationService } from 'src/app/_utilities/_services/registration.service';

@Component({
  selector: 'registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {
  public registration:User = new User();
  public passwordAgain:string = "";
  
  public registrationCheck:RegistrationCheck = new RegistrationCheck();
  
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  
  constructor(private registrationService: RegistrationService, private router:Router) { }
  
  

  ngOnInit(): void {
  }
  
  public SubmitRegistracija(userForm:any){
    if(this.registrationCheck.invalidRegistration)
      return;
      
      let registrationUser = {
        name : userForm.value.name,
        lastname : userForm.value.lastname,
        username : userForm.value.username,
        email : userForm.value.email,
        password : userForm.value.password //sifra se hashira serverside-field promenjen sa username na password
      }
    
      this.registrationService.registerUser(registrationUser, this, this.handleSuccess, this.handleError);
    
  }
  
  handleSuccess(self: any) {
    console.log("TEST");
    self.router.navigate(RedirectRoutes.ON_REGISTER_SUCCESSFUL);
  }

  handleError(self: any, message: string) {
    self.errorMessage = message;
    self.isSignUpFailed = true;
  }
  
  // Validacije
  
  public checkName(){
    this.registrationCheck.invalidName = false;
    
    if(!regExp.pattName.test(this.registration.name))
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

// Klasa koja cuva informacije o tome koje komponente nisu validne
class RegistrationCheck
{
  public invalidRegistration = true;
  
  public invalidName:boolean = false;
  public invalidLastname:boolean = false;
  public invalidUsername:boolean = false;
  public invalidEmail:boolean = false;
  public invalidPassword:boolean = false;
  public invalidPasswordAgain:boolean = false;
  
  constructor() {
      this.invalidRegistration = true;
      this.invalidName = false;
      this.invalidLastname = false;
      this.invalidUsername = false;
      this.invalidEmail = false;
      this.invalidPassword = false;
      this.invalidPasswordAgain = false;
  }
  
  public checkForm(){
      if(this.invalidName || this.invalidLastname || this.invalidUsername || this.invalidEmail || this.invalidPassword || this.invalidPasswordAgain)
          this.invalidRegistration = true;
      else
          this.invalidRegistration = false;
  }
}