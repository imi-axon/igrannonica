import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_utilities/_services/user.service';
import { regExp } from 'src/app/_utilities/_constants/regExp';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-changepass-form',
  templateUrl: './changepass-form.component.html',
  styleUrls: ['./changepass-form.component.scss']
})
export class ChangepassFormComponent implements OnInit {

  constructor(private userService:UserService, private activateroute:ActivatedRoute) { }
  private pattPass = regExp.pattPass;
  public invalidPass1:boolean=true;
  public invalidPass2:boolean=true;
  public pass1:string;
  public pass2:string;
  public password:string;
  pom?:any;
  ngOnInit(): void {
    this.activateroute.queryParams.subscribe(params=>{
      this.pom=params['token'];})
  }

  onSubmit(f:NgForm):void{
    if(!(this.invalidPass1 ||  this.invalidPass2)){
      console.log("tacno");
      //poslati back-u
      this.password=f.value.pass;
      console.log(this.password);
      this.userService.changePass(this.pom,this.password);
      
     } 
     else { console.log("Lozinka nije pravilna");}
  }

  public checkPass(){
    this.invalidPass1=false;
    if(!this.pattPass.test(this.pass1)){
      this.invalidPass1 = true;
    }
    this.checkPass2();
  }
  public checkPass2(){
    this.invalidPass2=false;
    if(!this.pattPass.test(this.pass1) || this.pass1!=this.pass2){
      this.invalidPass2 = true;
    }
  }
}
