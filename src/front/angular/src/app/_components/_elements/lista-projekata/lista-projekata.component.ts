import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/_utilities/_data-types/models';
import { AuthService } from 'src/app/_utilities/_services/auth.service';
import { ProjectsService } from 'src/app/_utilities/_services/projects.service';

@Component({
  selector: 'app-lista-projekata',
  templateUrl: './lista-projekata.component.html',
  styleUrls: ['./lista-projekata.component.scss']
})
export class ListaProjekataComponent implements OnInit {

  constructor(private projectsService:ProjectsService,private authService:AuthService) { }
  private username:string=this.authService.korisnickoIme;
  public projekti:Project[]=[];


  ngOnInit(): void {
   this.projectsService.userProjects(this.username,this,this.handleSuccess,this.handleError);
  }

  handleSuccess(self: any, projekti: Project[]) {
    console.log("Tacno jeeeeeee");
    if(projekti) self.projekti=projekti;
    //console.log(projekti[0]);
    //console.log(projekti[0].Description);
 
  }

  handleError(self: any, message: string) {
    console.log("GRESKA")
    // self.errorMessage = message;
    // self.isSignUpFailed = true;
  }

}
