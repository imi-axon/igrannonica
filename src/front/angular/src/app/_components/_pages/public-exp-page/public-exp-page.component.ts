import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectListComponent } from '../../_elements/project-list/project-list.component';

@Component({
  selector: 'app-public-exp-page',
  templateUrl: './public-exp-page.component.html',
  styleUrls: ['./public-exp-page.component.scss']
})
export class PublicExpPageComponent implements OnInit {

  constructor() { }

  @ViewChild(ProjectListComponent) projectListpublic:ProjectListComponent
  public publicExp:boolean=true;

  ngOnInit(): void {
  }

}
