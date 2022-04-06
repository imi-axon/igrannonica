import { Component, OnInit } from '@angular/core';
import { regExp } from 'src/app/_utilities/_constants/regExp';
import { RedirectRoutes } from 'src/app/_utilities/_constants/routing.properties';
import { EditUser, RegistrationCheck, UserRegistration, UserEditCheck} from 'src/app/_utilities/_data-types/models';
import { UserService } from 'src/app/_utilities/_services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/_utilities/_services/auth.service';

@Component({
  selector: 'app-edit-profile-form',
  templateUrl: './edit-profile-form.component.html',
  styleUrls: ['./edit-profile-form.component.scss']
})
export class EditProfileFormComponent implements OnInit {

  public split:string[];
  public edit:EditUser = new EditUser();
  public passwordAgain:string = "";
  
  public registrationCheck:UserEditCheck = new UserEditCheck();
  
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  
  constructor(private userService: UserService,public translate:TranslateService, public auth:AuthService) { }
  
  

  ngOnInit(): void {

  }
  
  public SubmitEdit(){
    if(this.registrationCheck.invalidRegistration)
      return;
    
    this.userService.editUser(this.edit);
    
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
    
    if(!regExp.pattName.test(this.edit.firstname))
      this.registrationCheck.invalidName = true;
    
    this.registrationCheck.checkForm();
  }
  
  public checkLastname(){
    this.registrationCheck.invalidLastname = false;
    
    if(!regExp.pattName.test(this.edit.lastname))
      this.registrationCheck.invalidLastname = true;
      
    this.registrationCheck.checkForm();
  }
  
  public checkUsername(){
    this.registrationCheck.invalidUsername = false;
    
    if(!regExp.pattUsername.test(this.edit.username))
      this.registrationCheck.invalidUsername = true;
      
    this.registrationCheck.checkForm();
  }
  
  public checkEmail(){
    this.registrationCheck.invalidEmail = false;
    
    if(!regExp.pattEmail.test(this.edit.email))
      this.registrationCheck.invalidEmail = true;
    if(this.edit.email=="")
      this.registrationCheck.invalidEmail = false;
      
    this.registrationCheck.checkForm();
  }
  
  public checkOldPassword(){
    this.registrationCheck.invalidOldPassword = false;
    
    if(!regExp.pattPass.test(this.edit.oldpassword))
      this.registrationCheck.invalidOldPassword = true;
    this.registrationCheck.checkForm();
  }

  public checkPassword(){
    this.registrationCheck.invalidPassword = false;
    
    if(!regExp.pattPass.test(this.edit.newpassword))
      this.registrationCheck.invalidPassword = true;
    if(this.edit.newpassword=="")
      this.registrationCheck.invalidPassword = false;
      
    this.checkPasswordAgain();
    this.registrationCheck.checkForm();
  }
  
  public checkPasswordAgain(){
    this.registrationCheck.invalidPasswordAgain = false;
    
    if(this.passwordAgain != this.edit.newpassword)
      this.registrationCheck.invalidPasswordAgain = true;
    if(!regExp.pattPass.test(this.passwordAgain) && this.edit.newpassword!="")
      this.registrationCheck.invalidPasswordAgain = true;
    if(this.edit.newpassword=="" && this.passwordAgain != this.edit.newpassword)
        this.registrationCheck.invalidPasswordAgain = true;
    this.registrationCheck.checkForm();
  }

}
