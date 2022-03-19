import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { apiProperties } from 'src/app/_utilities/_constants/api-properties';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  message:string="Niste ulogovani";

   url:string=apiProperties.url+"/api/user";

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.http.get(this.url).subscribe(

      (response)=>{console.log(response)},
      (error)=>{console.log(error)}

    )
  }

}
