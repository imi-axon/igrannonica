import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_utilities/_services/auth.service';
import { UserService } from 'src/app/_utilities/_services/user.service';
import { AppComponent } from 'src/app/app.component';
import { NewProjectService } from 'src/app/_utilities/_services/new-project.service';
import { NewProject } from 'src/app/_utilities/_data-types/models';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  userFullname: string = "";
  userImage: string = "assets/Images/profilna.png";


  constructor(
    public auth: AuthService,
    private userService: UserService,
    private newProjectService: NewProjectService,
    private router:Router
  ) { }
  private newProject: NewProject = new NewProject();

  ngOnInit(): void {

    this.userFullname = this.auth.ime_prezime;

    this.userService.getImage(this.auth.korisnickoIme, this, this.loadUserImage);
  }

  private loadUserImage(self: any, image: string) {
    self.userImage = image;
  }

  logout() {
    this.auth.logout();
  }

  public NewExperiment(){
    
    this.newProjectService.newProject(this.newProject, this, this.successfulNewProjectCallback)
  }
  
  private successfulNewProjectCallback(self: any, id: number){
    self.router.navigate(['/project/' + id]);

  }


}
