import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectListComponent } from '../../_elements/project-list/project-list.component';

@Component({
  selector: 'app-my-projects-page',
  templateUrl: './my-projects-page.component.html',
  styleUrls: ['./my-projects-page.component.scss']
})
export class MyProjectsPageComponent implements OnInit {

  @ViewChild(ProjectListComponent) projectList:ProjectListComponent
  public publicExp:boolean=false;

  constructor() { }

  ngOnInit(): void {
  }

}
