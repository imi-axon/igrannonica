import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { MyserviceService } from './myservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Project';
  name="";
  email = "";
  names:Array<string> = [];

  constructor(private myservice: MyserviceService, private router: Router) {}

  dodajKorisnika() {
    console.log(this.name + ":" + this.email);
    this.myservice.sendUser(this.name, this.email).subscribe((names)=>{
      console.log(names);
      this.names.push(names);
    })
  }


}
