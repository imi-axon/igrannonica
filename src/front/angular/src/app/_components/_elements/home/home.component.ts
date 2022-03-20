import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { JWTUtil } from 'src/app/_utilities/_helpers/jwt-util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  message:string="Niste ulogovani";
  private jwt:string;
  private ime:string;

  constructor(private http:HttpClient) { }

  ngOnInit(): void {

    this.jwt=JWTUtil.get();
    if(this.jwt!='') this.ime=JWTUtil.getUsername();
    if(this.jwt=='') this.message="Niste ulogovani";
    else this.message="Dobrodosli " + this.ime;
    
  }

}
