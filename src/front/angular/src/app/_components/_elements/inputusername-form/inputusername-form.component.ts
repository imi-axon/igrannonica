import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_utilities/_services/user.service';
import { regExp } from 'src/app/_utilities/_constants/regExp';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-inputusername-form',
  templateUrl: './inputusername-form.component.html',
  styleUrls: ['./inputusername-form.component.scss']
})
export class InputusernameFormComponent implements OnInit {
  
  public invalidUsername:boolean=true;
  private pattUsername = regExp.pattUsername;
  public user:string;
  public username:string;
  constructor(private userService:UserService) { }

  ngOnInit(): void {
  }

  onSubmit(f:NgForm)
  {
    if(!this.invalidUsername){
      console.log("tacno");
      //poslati back-u
      this.username=f.value.username;
      console.log(this.username);
      this.userService.sendEmail(this.username);
      
     } 
     else { console.log("Lozinka nije pravilna");}
  }

  public checkUsername(){
    this.invalidUsername=false;
    if(!this.pattUsername.test(this.user)){
      this.invalidUsername = true;
      console.log("netacan username")
    }
  }
}
