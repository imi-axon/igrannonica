import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { UserInfo } from 'src/app/_utilities/_data-types/models';
import { AuthService } from 'src/app/_utilities/_services/auth.service';
import { UserService } from 'src/app/_utilities/_services/user.service';

@Component({
  selector: 'app-profil-page',
  templateUrl: './profil-page.component.html',
  styleUrls: ['./profil-page.component.scss']
})
export class ProfilPageComponent implements OnInit {
  
  private subscription: Subscription;
  
  @ViewChild("profilePic")
  profilePictureRef: ElementRef;
  
  public userInfo: any = new UserInfo();
  public profilePicture: string;
  
  constructor(
    public auth:AuthService, 
    public service:UserService
  ) { }

  ngOnInit(): void {
    this.subscription = fromEvent(window, 'resize').subscribe( e => { this.onResize(e); });
    
    this.service.getInfo(this.auth.korisnickoIme, this, this.SetUserData);
    this.service.getImage(this.auth.korisnickoIme, this, this.SetProfilePicture);
    
    setTimeout(() => { this.profilePictureRef.nativeElement.height = this.profilePictureRef.nativeElement.width; }, 0);
  }
  
  SetUserData(self: any, response: any){
    console.log(response)
    self.userInfo.username = response.username;
    self.userInfo.firstname = response.firstname;
    self.userInfo.lastname = response.lastname;
    self.userInfo.email = response.email;
  }
  
  SetProfilePicture(self: any, response: any): void{
    self.profilePicture = response;
  }

  private onResize(event: Event){
    console.log("TEST")
    this.profilePictureRef.nativeElement.height = this.profilePictureRef.nativeElement.width;
  }
  
}
