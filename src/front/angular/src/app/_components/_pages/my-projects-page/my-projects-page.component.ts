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
    public router: Router
  ) { }

  @ViewChild("ProjectListComponent")
  projectList:ProjectListComponent
  public publicExp:boolean=false;


  ngOnInit(): void {
  }
  

}
