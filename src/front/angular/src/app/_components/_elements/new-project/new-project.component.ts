import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NewProject } from 'src/app/_utilities/_data-types/models';
import { NewProjectService } from 'src/app/_utilities/_services/new-project.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {

  public newProject:NewProject=new NewProject();

  constructor( private newProjectService:NewProjectService, private router:Router) {}

  onSubmit(f:NgForm)
  {
    this.newProject.name=f.value.projectName;
    this.newProject.description=f.value.projectDesc;
    if(f.value.public=='') this.newProject.public=false;
    else this.newProject.public=f.value.public;

    this.newProjectService.newProject(this.newProject,this,this.handleSuccess,this.handleError);

  }

  handleSuccess(self: any,id:any) {
    console.log("Tacno" + id);
    self.router.navigate(['dataset/'+id]);
    
    
    
  }

  handleError(self: any, message: string) {
     console.log("netacno")
    // self.errorMessage = message;
  }



  ngOnInit(): void {
  }

}
