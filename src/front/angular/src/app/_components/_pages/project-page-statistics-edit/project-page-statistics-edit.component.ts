import { Component, OnInit } from '@angular/core';
import { ProjectsService } from 'src/app/_utilities/_services/projects.service';

@Component({
  selector: 'app-project-page-statistics-edit',
  templateUrl: './project-page-statistics-edit.component.html',
  styleUrls: ['./project-page-statistics-edit.component.scss']
})
export class ProjectPageStatisticsEditComponent implements OnInit {

  constructor(public projectsService:ProjectsService) { }

  ngOnInit(): void {
  }

}
