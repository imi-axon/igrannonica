import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EditUser } from '../_data-types/models';
import { JWTUtil } from '../_helpers/jwt-util';
import { UserApiService } from '../_middleware/user-api.service';
import { UserRegistration } from '../_data-types/models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  @Input() user:UserRegistration;
  constructor(private userAPI:UserApiService, private http:HttpClient, private router:Router, public auth:AuthService) { }
  
  
    Register(applicantData: any, self?: any, successCallback?: Function, badRequestCallback?: Function, forbiddenCallback?: Function) {
      this.userAPI.Register(applicantData).subscribe(

        (response: any) => {

          if(response.status == HttpStatusCode.Ok)
            if(self && successCallback) 
              successCallback(self);
          
          if(response.status == HttpStatusCode.BadRequest)
            if(self && badRequestCallback)
              badRequestCallback(self,response.body.message);
          
          if(response.status == HttpStatusCode.Forbidden)
            if(self && forbiddenCallback)
              forbiddenCallback(self, response.body.message);
        }
      );
    }
    
    
    
    loginUser(applicantData: any, self?: any, successCallback?: Function, errorCallback?: Function) {
      this.userAPI.login(applicantData).subscribe(
        // Success
        (response:any) => {
          console.log("TEST");
          if (response.status== HttpStatusCode.Ok) { 
            console.log("TACNO");
            JWTUtil.store(response.body.v);
            if (self && successCallback) successCallback(self);
          }
        },
        (error:any) => {
          
          if(error.status==HttpStatusCode.BadRequest)
          {
            console.log("NETACNO");
            JWTUtil.delete();
            if (self && errorCallback) errorCallback(self);
          }
          if(error.status==HttpStatusCode.Forbidden)
          {
            console.log("NETACNO");
            JWTUtil.delete();
            if (self && errorCallback)
              errorCallback(self); 
          }
        }
      
      );
    }
    
    
    
    verifyUser(token:any){
      this.userAPI.verify(token).subscribe(
        res=>{
          console.log("Uspesno Verifikovan");
          this.router.navigate(['login'])
        },
        err=>{
          console.log(err)
        }
      )
    }

    changePass(token:any, password:string)
    {
      this.userAPI.changepass(token, password).subscribe(
        res=>{
          console.log("Uspesno Promenjen password");
          this.router.navigate(['login'])
        },
        err=>{
          console.log(err)
        }
      )
    }

    sendEmail(username:string)
    {
      this.userAPI.sendemail(username).subscribe(
        res=>{
          console.log("Poslat mail");
          this.router.navigate(['succes-pass'])
        },
        err=>{
          console.log(err)
        }
      )
    }

    editUser1(model:EditUser)
    {
      console.log(model.lastname);
      this.userAPI.edituser1(model).subscribe(
        res=>{
          JWTUtil.delete();
          this.auth.logovan=false;
          this.auth.korisnickoIme='';
          console.log("Uspesno editovan korisnik");
          this.router.navigate(['login'])
        },
        err=>{
          console.log(err)
        }
      )
    }
    editUser2(model:EditUser)
    {
      console.log(model.lastname);
      this.userAPI.edituser2(model).subscribe(
        res=>{
          JWTUtil.delete();
          this.auth.logovan=false;
          this.auth.korisnickoIme='';
          console.log("Uspesno editovan korisnik");
          this.router.navigate(['login'])
        },
        err=>{
          console.log(err)
        }
      )
    }
    editUser3(model:EditUser)
    {
      console.log(model.lastname);
      this.userAPI.edituser3(model).subscribe(
        res=>{
          JWTUtil.delete();
          this.auth.logovan=false;
          this.auth.korisnickoIme='';
          console.log("Uspesno editovan korisnik");
          this.router.navigate(['login'])
        },
        err=>{
          console.log(err)
        }
      )
    }
    editUser4(model:any)
    {
      console.log(model.lastname);
      this.userAPI.edituser4(model).subscribe(
        res=>{
          console.log("Uspesno promenjena slika");
          this.router.navigate(['profil'])
        },
        err=>{
          console.log(err)
        }
      )
    }
    getInfo(username:string, self?: any, successCallback?: Function, errorCallback?: Function)
    {
        this.userAPI.getinfo(username).subscribe(
      
          (response) => {
            if (response.status== HttpStatusCode.Ok) { 
                if(response.body!=null)
                  this.user=response.body;
                if (self && successCallback) 
                  successCallback(self,this.user);
            }
            if(response.status==HttpStatusCode.NotFound)
            {
              console.log("NETACNO");
              if (self && errorCallback) errorCallback(self, response.status);
            }
          }
        
        );
    }

    public getImage(username:string, self: any, successCallback: Function)
    {
      this.userAPI.getimage(username).subscribe(
        (res: any)=>{
          let reader = new FileReader();
          reader.addEventListener("load", () => {
            self.imageBlobUrl = reader.result;
            successCallback(self, reader.result);
          }, false);
          reader.readAsDataURL(res.body);
        }
      )
    }

}