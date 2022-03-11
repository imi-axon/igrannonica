import { Component, Input, OnInit } from '@angular/core';
import { Registration } from 'src/app/_utilities/_api/_data-types/models';

@Component({
  selector: 'registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {
  private patterns:Patterns = new Patterns();
  
  public registration:Registration = new Registration();
  public passwordAgain:string = "";
  
  public registrationCheck:RegistrationCheck = new RegistrationCheck();
  
  
  
  constructor() { }

  ngOnInit(): void {
  }
  
  public SubmitRegistracija(form:any){
    if(this.registrationCheck.invalidRegistration)
      return;
    
    console.log(this.registration);
    console.log(this.passwordAgain);
  }
  
  
  // Validacije
  
  public checkName(){
    this.registrationCheck.invalidName = false;
    
    if(!this.patterns.name.test(this.registration.name))
      this.registrationCheck.invalidName = true;
    
    this.registrationCheck.checkForm();
  }
  
  public checkLastname(){
    this.registrationCheck.invalidLastname = false;
    
    if(!this.patterns.name.test(this.registration.lastname))
      this.registrationCheck.invalidLastname = true;
      
    this.registrationCheck.checkForm();
  }
  
  public checkUsername(){
    this.registrationCheck.invalidUsername = false;
    
    if(!this.patterns.username.test(this.registration.username))
      this.registrationCheck.invalidUsername = true;
      
    this.registrationCheck.checkForm();
  }
  
  public checkEmail(){
    this.registrationCheck.invalidEmail = false;
    
    if(!this.patterns.email.test(this.registration.email))
      this.registrationCheck.invalidEmail = true;
      
    this.registrationCheck.checkForm();
  }
  
  public checkPassword(){
    this.registrationCheck.invalidPassword = false;
    
    if(!this.patterns.password.test(this.registration.password))
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

// Paterni za regex
class Patterns{
  public readonly name: RegExp = /^[a-zA-ZšŠđĐčČćĆžŽ]+([ \-][a-zA-ZšŠđĐčČćĆžŽ]+)*$/;
  public readonly username: RegExp = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
  public readonly email: RegExp = /^[a-zA-Z0-9]+([\.\-\+][a-zA-Z0-9]+)*\@([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}$/;
  public readonly password: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  //public readonly pattTwoSpaces: RegExp = /  /;
  //public readonly pattPhone: RegExp = /^(0|(\+[1-9][0-9]{0,2}))[1-9][0-9][0-9]{6,7}$/;
  //public readonly pattAddr: RegExp = /^[0-9a-zA-ZšŠđĐčČćĆžŽ\/ \-\,\.\'\(\)\&]{1,80}$/;
}