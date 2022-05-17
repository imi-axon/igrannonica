import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RedirectRoutes } from 'src/app/_utilities/_constants/routing.properties';
import { NewProject } from 'src/app/_utilities/_data-types/models';
import { JWTUtil } from 'src/app/_utilities/_helpers/jwt-util';
import { AuthService } from 'src/app/_utilities/_services/auth.service';
import { NewProjectService } from 'src/app/_utilities/_services/new-project.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private router: Router,
    private newProjectService: NewProjectService
  ) { }

  private newProject: NewProject = new NewProject();

  ngOnInit(): void {
  }
  
  Logout()
  {
   this.authService.logout();
  }

  public NewExperiment(){
    
    this.newProjectService.newProject(this.newProject, this, this.successfulNewProjectCallback)
  }
  
  private successfulNewProjectCallback(self: any, id: number){
    self.router.navigate(['/project/' + id]);

  }
  

}
