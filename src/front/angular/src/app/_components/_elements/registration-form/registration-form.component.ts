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
  public photo: File = null as any;
  url = 'assets/Images/profilna.png';
  public registrationCheck:RegistrationCheck = new RegistrationCheck();
  
  selectedFile:File = null as any;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  
  constructor(private userService: UserService,public translate:TranslateService) { }
  
  

  ngOnInit(): void {
  }
  
  public SubmitRegistracija(){
    if(this.registrationCheck.invalidRegistration)
      return;
    
    let formData : FormData = new FormData();
    if(!this.selectedFile)
      formData.append("photo", null as any);
    else
      formData.append("photo", this.selectedFile, this.selectedFile.name);
    formData.append("firstname", this.registration.firstname);
    formData.append("lastname", this.registration.lastname);
    formData.append("email", this.registration.email);
    formData.append("username", this.registration.username);
    formData.append("password", this.registration.password);
    this.userService.Register(formData, this, this.handleSuccess, this.handleUsedUsername, this.handleLogedIn);
    
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
  public selectPhoto(event:any) {
    let fileType = event.target.files[0].type
    this.selectedFile=<File>event.target.files[0];
    if (fileType.match(/image\/*/)) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
        
      };
    } 
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