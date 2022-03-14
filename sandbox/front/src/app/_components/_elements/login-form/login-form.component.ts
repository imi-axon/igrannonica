import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { regExp } from 'src/app/_utilities/_constants/regExp';
import { LoginApiService } from 'src/app/_utilities/_services/login-api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  constructor(
    private service:LoginApiService,
    private router:Router
  ) { }

   private pattEmail = regExp.pattEmail;
   private pattPass = regExp.pattPass;

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
       //poslati back-u
    
       this.service.login(f.value).subscribe(
          {
            next:(res:any)=>{localStorage.setItem('token',res.token);this.router.navigateByUrl('/csv')}, // umesto csv staviti home page kada bude napravljena
            error:(err:any)=>{console.log(err)}
          }

       );
       
      } 
      else { console.log("Lozinka nije pravilna"); this.invalidPass=true;}
    }
    else {console.log("Email nije pravilan"); this.invalidEmail=true}
  }

}
