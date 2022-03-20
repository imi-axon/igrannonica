import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Project } from 'src/app/_utilities/_data-types/models';
import { NewProjectService } from 'src/app/_utilities/_services/new-project.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {

  public newProject:Project=new Project();

  constructor( private newProjectService:NewProjectService) {}

  onSubmit(f:NgForm)
  {
    this.newProject.name=f.value.projectName;
    this.newProject.description=f.value.projectDesc;
    if(f.value.public=='') this.newProject.isPublic=false;
    else this.newProject.isPublic=f.value.public;

    // console.log(f.value);
    // console.log(this.newProject.name,this.newProject.description,this.newProject.isPublic);

    this.newProjectService.newProject(this.newProject,this,this.handleSuccess,this.handleError,this.handleError);

  }

  handleSuccess(self: any) {
    console.log("Tacno");
    
  }

  handleError(self: any, message: string) {
    self.errorMessage = message;
    self.isSignUpFailed = true;
  }

  ngOnInit(): void {
  }

}
