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

  private username:string=this.auth.korisnickoIme;
  public user:UserRegistration;

  public newphoto: File = null as any;
  public imageBlobUrl:any;
  public split:string[];
  public edit:EditUser = new EditUser();
  public passwordAgain:string = "";
  
  public registrationCheck:UserEditCheck = new UserEditCheck();
  
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  
  constructor(private userService: UserService,public translate:TranslateService, public auth:AuthService) { }
  
  

  ngOnInit(): void {
    this.userService.getInfo(this.username,this,this.handleUserSuccess,this.handleError);
    this.userService.getImage(this.auth.korisnickoIme, this, this.prikazslike);
  }

  public selectPhoto(event:any) {
    let fileType = event.target.files[0].type
    this.newphoto=<File>event.target.files[0];
    if (fileType.match(/image\/*/)) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.imageBlobUrl = event.target.result;
        
      };
    } 
  }
  prikazslike(self: any, response: any): void{
    /*let reader = new FileReader();
    reader.addEventListener("load", () => {
      self.imageBlobUrl = reader.result;
    }, false);
    reader.readAsDataURL(response.body);*/
    self.imageBlobUrl = response;
  }
  public SubmitEdit1(){
    if(this.registrationCheck.invalidRegistration1)
      return;
    
    this.userService.editUser1(this.edit);
  }
  public SubmitEdit2(){
    if(this.registrationCheck.invalidRegistration2)
      return;
    
    this.userService.editUser2(this.edit);
  }
  public SubmitEdit3(){
    if(this.registrationCheck.invalidRegistration3)
      return;
    
    this.userService.editUser3(this.edit);
  }
  public SubmitEdit4(){
    if(this.registrationCheck.invalidRegistration4)
      return;
    
    let formData : FormData = new FormData();

    formData.append("photo", this.newphoto, this.newphoto.name);
    formData.append("firstname", this.edit.firstname);
    formData.append("lastname", this.edit.lastname);
    formData.append("email", this.edit.email);
    formData.append("username", this.edit.username);
    formData.append("oldpassword1", this.edit.oldpassword4);
    formData.append("oldpassword2", this.edit.oldpassword4);
    formData.append("oldpassword3", this.edit.oldpassword4);
    formData.append("oldpassword4", this.edit.oldpassword4);
    formData.append("newpassword", this.edit.oldpassword4);
    this.userService.editUser4(formData);
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

  handleUserSuccess(self: any, user: UserRegistration) {
    console.log("Tacno jeeeeeee");
    if(user) self.user=user;
    self.edit.firstname=user.firstname;
    self.edit.lastname=user.lastname;
    self.edit.username=user.username;
    self.edit.email=user.email;
    self.checkEmail();
    self.checkName();
    self.checkLastname();
    self.checkUsername();
    //console.log(projekti[0]);
    //console.log(projekti[0].Description);
 
  }
  handleError(self: any, message: string) {
    console.log("GRESKA")
    // self.errorMessage = message;
    // self.isSignUpFailed = true;
  }
  
  
  // Validacije
  
  public checkName(){
    this.registrationCheck.invalidName = false;
    
    if(!regExp.pattName.test(this.edit.firstname))
      this.registrationCheck.invalidName = true;
    
    this.registrationCheck.checkForm1();
  }
  
  public checkLastname(){
    this.registrationCheck.invalidLastname = false;
    
    if(!regExp.pattName.test(this.edit.lastname))
      this.registrationCheck.invalidLastname = true;
      
    this.registrationCheck.checkForm1();
  }
  
  public checkUsername(){
    this.registrationCheck.invalidUsername = false;
    
    if(!regExp.pattUsername.test(this.edit.username))
      this.registrationCheck.invalidUsername = true;
      
    this.registrationCheck.checkForm1();
  }
  
  public checkEmail(){
    this.registrationCheck.invalidEmail = false;
    
    if(!regExp.pattEmail.test(this.edit.email))
      this.registrationCheck.invalidEmail = true;
    if(this.edit.email=="")
      this.registrationCheck.invalidEmail = false;
      
    this.registrationCheck.checkForm2();
  }
  
  public checkOldPassword1(){
    this.registrationCheck.invalidOldPassword1 = false;
    
    if(!regExp.pattPass.test(this.edit.oldpassword1))
      this.registrationCheck.invalidOldPassword1 = true;
    this.registrationCheck.checkForm1();
  }
  public checkOldPassword2(){
    this.registrationCheck.invalidOldPassword2 = false;
    
    if(!regExp.pattPass.test(this.edit.oldpassword2))
      this.registrationCheck.invalidOldPassword2 = true;
    this.registrationCheck.checkForm2();
  }
  public checkOldPassword3(){
    this.registrationCheck.invalidOldPassword3 = false;
    
    if(!regExp.pattPass.test(this.edit.oldpassword3))
      this.registrationCheck.invalidOldPassword3 = true;
    this.registrationCheck.checkForm3();
  }

  public checkOldPassword4(){
    this.registrationCheck.invalidOldPassword4 = false;
    
    if(!regExp.pattPass.test(this.edit.oldpassword4))
      this.registrationCheck.invalidOldPassword4 = true;
    this.registrationCheck.checkForm4();
  }

  public checkPassword(){
    this.registrationCheck.invalidPassword = false;
    
    if(!regExp.pattPass.test(this.edit.newpassword))
      this.registrationCheck.invalidPassword = true;
      
    this.checkPasswordAgain();
    this.registrationCheck.checkForm3();
  }
  
  public checkPasswordAgain(){
    this.registrationCheck.invalidPasswordAgain = false;
    
    if(this.passwordAgain != this.edit.newpassword || this.passwordAgain.length == 0)
      this.registrationCheck.invalidPasswordAgain = true;

    this.registrationCheck.checkForm3();
  }

}
