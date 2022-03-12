import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { regExp } from 'src/app/_utilities/_constants/RegExp';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  constructor() { }
  public pattEmail = regExp.pattEmail;
  public pattPass = regExp.pattPass;

  ngOnInit(): void {
  }

  public invalidEmail:boolean;
  public invalidPass:boolean;

  onSubmit(f:NgForm)
  {
    console.log(f.value);
    console.log(f.valid);

    this.invalidEmail=false;
    this.invalidPass=false;

    if (this.pattEmail.test(f.value.email)) {
      if(this.pattPass.test(f.value.pass)){
       console.log("tacno");
      }
      else { console.log("Lozinka nije pravilna"); this.invalidPass=true;}
    }
    else {console.log("Email nije pravilan"); this.invalidEmail=true}
  }

}
