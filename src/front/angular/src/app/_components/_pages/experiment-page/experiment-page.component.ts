import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/_utilities/_data-types/models';
import { DatasetService } from 'src/app/_utilities/_services/dataset.service';
import { ProjectsService } from 'src/app/_utilities/_services/projects.service';

@Component({
  selector: 'app-experiment-page',
  templateUrl: './experiment-page.component.html',
  styleUrls: ['./experiment-page.component.scss']
})
export class ExperimentPageComponent implements OnInit {
  
  constructor(
    public projectsService: ProjectsService,
    public activatedRoute: ActivatedRoute,
    public router:Router
  ) { }
  
  // Project
  public project: Project = new Project();
  public projectId: number;
  private checkProjectId(){
    let p = this.activatedRoute.snapshot.paramMap.get("ProjectId");
    if (p != null)  {
      this.projectId = Number.parseInt(p);
      //console.log('ProjectId')
      //console.log(this.ProjectId)
    }
  }
  
  // Cards
  public currentCard: string = ".";
  

  ngOnInit(): void {
    this.checkProjectId();
    this.projectsService.getProject(this.projectId, this, this.handleSuccesfulGetProjectCallback);
  }
  
  private handleSuccesfulGetProjectCallback(self: ExperimentPageComponent, response: any){
    self.project = response;
  }
  
  public SwitchCard(cardName: string){
    this.currentCard = cardName;
    this.router.navigate([cardName],{relativeTo:this.activatedRoute});
  }
  

}
