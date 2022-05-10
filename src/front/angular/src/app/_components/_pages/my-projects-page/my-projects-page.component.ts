import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NewProject } from 'src/app/_utilities/_data-types/models';
import { NewProjectService } from 'src/app/_utilities/_services/new-project.service';
import { ProjectListComponent } from '../../_elements/project-list/project-list.component';

@Component({
  selector: 'app-my-projects-page',
  templateUrl: './my-projects-page.component.html',
  styleUrls: ['./my-projects-page.component.scss']
})
export class MyProjectsPageComponent implements OnInit {
  constructor(
    public router: Router,
    private newProjectService: NewProjectService
  ) { }
  
  private newProject: NewProject = new NewProject();

  @ViewChild("ProjectListComponent")
  projectList:ProjectListComponent
  public publicExp:boolean=false;


  ngOnInit(): void {
    this.setNewProject();
  }

  private setNewProject(){
    this.newProject.name = "Untitled Project";
    this.newProject.description = "Project description goes here...";
    this.newProject.public = false;
  }
  
  public NewExperiment(){
    
    this.newProjectService.newProject(this.newProject, this, this.successfulNewProjectCallback)
  }
  
  private successfulNewProjectCallback(self: any, id: number){
    self.router.navigate(['/project/' + id]);
  }
  

}
