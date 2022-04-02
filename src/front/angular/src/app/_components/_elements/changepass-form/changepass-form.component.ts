import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_utilities/_services/user.service';
import { regExp } from 'src/app/_utilities/_constants/regExp';
@Component({
  selector: 'app-changepass-form',
  templateUrl: './changepass-form.component.html',
  styleUrls: ['./changepass-form.component.scss']
})
export class ChangepassFormComponent implements OnInit {

  constructor(private userService:UserService) { }
  private pattPass = regExp.pattPass;
  public invalidPass1:boolean=true;
  public invalidPass2:boolean=true;
  public pass1:string;
  public pass2:string;
  ngOnInit(): void {
  }

  onSubmit(f:NgForm):void{

  }

  public checkPass(){
    this.invalidPass1=false;
    if(!this.pattPass.test(this.pass1)){
      this.invalidPass1 = true;
    }
  }
  public checkPass2(){
    this.invalidPass2=false;
    if(!this.pattPass.test(this.pass1) || this.pass1!=this.pass2){
      this.invalidPass2 = true;
    }
  }
}
