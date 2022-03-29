import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserApiService } from 'src/app/_utilities/_middleware/user-api.service';
import { UserService } from 'src/app/_utilities/_services/user.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {

  pom?:any
  ind=false
  constructor(private activateroute:ActivatedRoute, private verifyservice:UserService, private route:Router) { }

  ngOnInit(): void {
    this.activateroute.queryParams.subscribe(params=>{
      this.pom=params['token'];})
      this.sendrequest();
  }

  sendrequest()
  {
    this.verifyservice.verifyUser(this.pom).subscribe(
      res=>{
        this.route.navigate(['login'])
      },
      err=>{
        console.log(err)
      }
    );
  }
}
