import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_utilities/_services/auth.service';
import { UserService } from 'src/app/_utilities/_services/user.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {


  public imageBlobUrl:any;
  constructor(public auth:AuthService, public service:UserService) { }

  ngOnInit(): void {
   this.service.getImage(this.auth.korisnickoIme, this, this.prikazslike);
  }

  prikazslike(self: any, response: any): void{
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      self.imageBlobUrl = reader.result;
    }, false);
    reader.readAsDataURL(response.body);
  }
}
